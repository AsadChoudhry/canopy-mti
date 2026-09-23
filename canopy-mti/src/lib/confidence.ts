import type { Confidence, FitStatus } from '@/data/types'

export const CONFIDENCE_META: Record<Confidence, { label: string; short: string; colour: string; bg: string; text: string; border: string; dot: string }> = {
  verified: { label: 'Verified / known', short: 'Known', colour: '#009a7e', bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-200', dot: 'bg-green-500' },
  partial: { label: 'Partially known', short: 'Partial', colour: '#e09a12', bg: 'bg-amber-100', text: 'text-amber-600', border: 'border-amber-400', dot: 'bg-amber-500' },
  unknown: { label: 'Unknown', short: 'Unknown', colour: '#9aa3ad', bg: 'bg-slate-100', text: 'text-slate-500', border: 'border-slate-300', dot: 'bg-slate-400' },
  inferred: { label: 'Inferred / derived', short: 'Derived', colour: '#009da1', bg: 'bg-inferred-100', text: 'text-inferred-600', border: 'border-inferred-500/40', dot: 'bg-inferred-500' },
}

export const FIT_META: Record<FitStatus, { label: string; confidence: Confidence }> = {
  confirmed: { label: 'Confirmed', confidence: 'verified' },
  potential_match: { label: 'Potential match', confidence: 'partial' },
  potential_overlap: { label: 'Potential overlap', confidence: 'partial' },
  unknown: { label: 'Unknown', confidence: 'unknown' },
  mismatch: { label: 'Likely mismatch', confidence: 'inferred' },
}
