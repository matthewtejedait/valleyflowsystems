export default async (req) => {
  const { business } = await req.json();

  const prompt = `You are a business automation consultant analyzing a local business for Valley Flow Systems, a done-for-you automation agency in California's Central Valley.

Search the web for: "${business}"

Find and analyze:
1. Google reviews — what do customers complain about?
2. Do they have a website? Online booking?
3. Signs of operational pain (slow response, no follow-up, hard to reach)?

Return:
- BUSINESS SNAPSHOT (2-3 sentences)
- PAIN POINTS (specific bullets, cite reviews if found)
- AUTOMATION FIT (which applies: Lead Response, Booking Intake, Appointment Reminders, Day-Before SMS, Review/Referral)
- FIT SCORE: High / Medium / Low + one sentence why

Be direct. If you can't find info, say so.`;

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: 1000,
      tools: [{ type: 'web_search_20250305', name: 'web_search' }],
      messages: [{ role: 'user', content: prompt }]
    })
  });

  const data = await response.json();
  return Response.json(data);
};

export const config = { path: '/api/research' };
