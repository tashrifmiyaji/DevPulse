export interface IIssues {
    title: string,
    description: string,
    type: 'bug' | "feature",
    status?: string
}