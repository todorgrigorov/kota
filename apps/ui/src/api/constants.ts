import type { EstimateStatus } from '../types';
import type { RawEstimateStatus } from './types';

export const RAW_STATUS_TO_STATUS: Record<RawEstimateStatus, EstimateStatus> = {
  draft: { id: 'draft', label: 'Draft', color: 'gray' },
  submitted: { id: 'submitted', label: 'Submitted', color: 'blue' },
  quote_available: { id: 'quote_available', label: 'Quote Available', color: 'cyan' },
  pending_approval: {
    id: 'pending_approval',
    label: 'Pending Approval',
    color: 'orange',
    title: 'Awaiting approval',
    body: 'Your request has been submitted and is pending manager approval.',
  },
  finalised: {
    id: 'finalised',
    label: 'Finalised',
    color: 'green',
    title: 'Booking confirmed',
    body: 'Your event package has been finalised.',
  },
  rejected: {
    id: 'rejected',
    label: 'Rejected',
    color: 'red',
    title: 'Request rejected',
    body: 'Your request was not approved. Please contact your manager.',
  },
  expired: {
    id: 'expired',
    label: 'Expired',
    color: 'gray',
    title: 'Request expired',
    body: 'This request has expired. Please start a new booking.',
  },
};
