
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'
import { OpenAI } from "https://esm.sh/openai@4.28.0"
import "https://deno.land/x/xhr@0.1.0/mod.ts"

const OPENROUTER_API_KEY = Deno.env.get('OPENROUTER_API_KEY')
const OPENROUTER_MODEL = 'deepseek/deepseek-chat-v3-0324:free'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Create OpenAI client with OpenRouter configuration
const openai = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: OPENROUTER_API_KEY,
  defaultHeaders: {
    'HTTP-Referer': 'https://localhost:5173', // Optional
    'X-Title': 'Document Analysis System' // Optional
  }
})

// Default system prompt
const DEFAULT_SYSTEM_PROMPT = `You are a legal document analysis assistant. Analyze the provided document text and return a JSON response with the following structure:
{
  "summary": "Brief overview of the document",
  "key_findings": [
    {
      "title": "Finding title",
      "description": "Detailed description",
      "risk_level": "high|medium|low"
    }
  ],
  "clauses": [
    {
      "title": "Clause title",
      "content": "Relevant text",
      "risk_level": "high|medium|low"
    }
  ]
}`

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    console.log('Received analyze-document request')
    
    const { documentId, documentText } = await req.json()

    if (!documentId || !documentText) {
      console.error('Missing required parameters')
      throw new Error('Missing required parameters: documentId or documentText')
    }

    console.log('Starting analysis for document:', documentId)
    console.log('Document text length:', documentText.length)

    // Create Supabase client
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    )

    // Update document status to analyzing
    const { error: updateError } = await supabaseAdmin
      .from('documents')
      .update({ status: 'analyzing' })
      .eq('id', documentId)

    if (updateError) {
      console.error('Error updating document status:', updateError)
      throw updateError
    }

    console.log('Document status updated to analyzing')
    
    // Verify OpenRouter API key exists
    if (!OPENROUTER_API_KEY) {
      console.error('OPENROUTER_API_KEY is not set')
      throw new Error('OPENROUTER_API_KEY is not set')
    }

    console.log('Calling OpenRouter API with model:', OPENROUTER_MODEL)
    
    // Call OpenRouter API using the OpenAI SDK
    const completion = await openai.chat.completions.create({
      model: OPENROUTER_MODEL,
      messages: [
        { role: 'system', content: DEFAULT_SYSTEM_PROMPT },
        { role: 'user', content: documentText.substring(0, 8000) } // Limit text length to avoid token issues
      ],
      temperature: 0.3,
      max_tokens: 1500
    })

    if (!completion.choices[0]?.message?.content) {
      console.error('No analysis results received from OpenRouter')
      throw new Error('No analysis results received')
    }

    console.log('Analysis received from OpenRouter')
    
    let analysisResult
    try {
      analysisResult = JSON.parse(completion.choices[0].message.content)
    } catch (parseError) {
      console.error('Failed to parse OpenRouter response:', parseError)
      console.log('Raw response:', completion.choices[0].message.content)
      throw new Error('Failed to parse analysis results')
    }

    console.log('Analysis parsed successfully')
    
    // Create new analysis record
    const { data: analysis, error: analysisError } = await supabaseAdmin
      .from('document_analysis')
      .insert({
        document_id: documentId,
        summary: analysisResult.summary
      })
      .select()
      .single()

    if (analysisError) {
      console.error('Error creating analysis record:', analysisError)
      throw analysisError
    }

    console.log('Analysis record created with ID:', analysis.id)
    
    // Insert key findings
    if (analysisResult.key_findings?.length > 0) {
      const { error: findingsError } = await supabaseAdmin
        .from('key_findings')
        .insert(
          analysisResult.key_findings.map((finding: any) => ({
            analysis_id: analysis.id,
            title: finding.title,
            description: finding.description,
            risk_level: finding.risk_level
          }))
        )

      if (findingsError) {
        console.error('Error inserting key findings:', findingsError)
        throw findingsError
      }
      
      console.log('Inserted key findings:', analysisResult.key_findings.length)
    }

    // Insert clauses
    if (analysisResult.clauses?.length > 0) {
      const { error: clausesError } = await supabaseAdmin
        .from('clauses')
        .insert(
          analysisResult.clauses.map((clause: any) => ({
            analysis_id: analysis.id,
            title: clause.title,
            content: clause.content,
            risk_level: clause.risk_level
          }))
        )

      if (clausesError) {
        console.error('Error inserting clauses:', clausesError)
        throw clausesError
      }
      
      console.log('Inserted clauses:', analysisResult.clauses.length)
    }

    // Calculate overall risk level based on findings and clauses
    const allRiskLevels = [
      ...(analysisResult.key_findings || []).map((f: any) => f.risk_level),
      ...(analysisResult.clauses || []).map((c: any) => c.risk_level)
    ]
    
    const overallRisk = allRiskLevels.includes('high') ? 'high' :
                       allRiskLevels.includes('medium') ? 'medium' : 'low'
                       
    console.log('Calculated overall risk level:', overallRisk)

    // Update document status and risk level
    const { error: finalUpdateError } = await supabaseAdmin
      .from('documents')
      .update({ 
        status: 'analyzed',
        risk_level: overallRisk
      })
      .eq('id', documentId)

    if (finalUpdateError) {
      console.error('Error updating final document status:', finalUpdateError)
      throw finalUpdateError
    }

    console.log('Document analysis completed successfully')
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        analysisId: analysis.id,
        risk_level: overallRisk
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error in analyze-document function:', error)
    
    // Try to update document status to error if possible
    try {
      const { documentId } = await req.json().catch(() => ({ documentId: null }))
      
      if (documentId) {
        const supabaseAdmin = createClient(
          Deno.env.get('SUPABASE_URL') ?? '',
          Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
          {
            auth: {
              autoRefreshToken: false,
              persistSession: false,
            },
          }
        )

        await supabaseAdmin
          .from('documents')
          .update({ status: 'error' })
          .eq('id', documentId)
          
        console.log('Updated document status to error')
      }
    } catch (updateError) {
      console.error('Error updating document status to error:', updateError)
    }

    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error',
        details: 'Document analysis failed. Please try again or contact support.'
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
