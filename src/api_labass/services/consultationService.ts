// consultationService.ts
export const consultationService = {
    async updateConsultationStatus(id: number, status: string): Promise<void> {
        // Implementation
        console.log(`Updating status for consultation ${id} to ${status}`);
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate async operation
    }
};
