import type { User } from "./user.types";

export type AnalysisCandidate = {
    analysisId: string;
    candidateId: string;
    analysis_summary: string;
    score: number;
    technical_match_score: number;
    business_fit_score: number;
    behavioral_match_score: number;
    candidate: User;
}

export type Analysis = {
    id: string;
    userId: string;
    status: "PENDING" | "COMPLETED" | "FAILED";
    createdAt: string;
    updatedAt: string;
    query: string;
}

export type AnalysisResponse = {
    analysis: { id: string };
    users: AnalysisCandidate[];
}

export type ListAnalysisResponse = {
    data: Analysis[];
    total: number;
    page: number;
    limit: number;
}

export type GetAnalysisByIdResponse = {
    analysis: Analysis;
    users: AnalysisCandidate[];
}
