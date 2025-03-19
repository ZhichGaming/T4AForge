import { T4ASlipData, T4ASummaryData } from "./T4A.types";
import T619FormData from "./T619.types";

export type SubmissionYearRecord = {
  year: number;
  submissions: SubmissionRecord[];
};

export type SubmissionRecord = {
  id: string;

  t619: T619FormData;
  t4a: T4ASlipData[];
  t4aSummary: T4ASummaryData;
};
