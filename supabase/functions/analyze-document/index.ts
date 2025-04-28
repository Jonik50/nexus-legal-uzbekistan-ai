
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"

const OPENROUTER_API_KEY = Deno.env.get('OPENROUTER_API_KEY')
const OPENROUTER_MODEL = Deno.env.get('OPENROUTER_MODEL') || 'deepseek/deepseek-chat-v3-0324:free'
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

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { documentId, documentText } = await req.json()

    if (!documentId || !documentText) {
      throw new Error('Missing required parameters')
    }

    // Call OpenRouter API
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'HTTP-Referer': 'https://localhost:5173',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: OPENROUTER_MODEL,
        messages: [
          { role: 'system', content: DEFAULT_SYSTEM_PROMPT },
          { role: 'user', content: documentText }
        ]
      })
    })

    const data = await response.json()
    
    if (!response.ok) {
      console.error('OpenRouter API error:', data)
      throw new Error('Failed to analyze document')
    }

    const analysisResult = JSON.parse(data.choices[0].message.content)

    // Create new analysis record
    const { data: analysis, error: analysisError } = await supabase
      .from('document_analysis')
      .insert({
        document_id: documentId,
        summary: analysisResult.summary
      })
      .select()
      .single()

    if (analysisError) throw analysisError

    // Insert key findings
    if (analysisResult.key_findings?.length > 0) {
      const { error: findingsError } = await supabase
        .from('key_findings')
        .insert(
          analysisResult.key_findings.map((finding: any) => ({
            analysis_id: analysis.id,
            title: finding.title,
            description: finding.description,
            risk_level: finding.risk_level
          }))
        )

      if (findingsError) throw findingsError
    }

    // Insert clauses
    if (analysisResult.clauses?.length > 0) {
      const { error: clausesError } = await supabase
        .from('clauses')
        .insert(
          analysisResult.clauses.map((clause: any) => ({
            analysis_id: analysis.id,
            title: clause.title,
            content: clause.content,
            risk_level: clause.risk_level
          }))
        )

      if (clausesError) throw clausesError
    }

    // Update document status
    const { error: updateError } = await supabase
      .from('documents')
      .update({ status: 'analyzed' })
      .eq('id', documentId)

    if (updateError) throw updateError

    return new Response(
      JSON.stringify({ success: true, analysisId: analysis.id }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error in analyze-document function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
