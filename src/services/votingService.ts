import { simulateApiDelay, createPaginatedResponse } from './api';
import type { PaginatedResponse } from './api';
import type { Resolution, Vote, VotingResult } from '../types/voting.types';
import { VoteDecision, ResolutionStatus, VotingRule } from '../types/voting.types';
import { mockResolutions } from '../mocks';
import { UserRole } from '../types/auth.types';
import { mockUsers } from '../mocks';

export interface ResolutionFilters {
  status?: ResolutionStatus;
  votingRule?: VotingRule;
  category?: string;
  relatedMeetingId?: string;
  startDate?: Date;
  endDate?: Date;
  search?: string;
  page?: number;
  pageSize?: number;
}

export interface CreateResolutionData {
  title: string;
  description: string;
  votingDeadline: Date;
  votingRule: VotingRule;
  isAnonymous?: boolean;
  attachments?: string[];
  category?: string;
  relatedMeetingId?: string;
}

export interface CastVoteData {
  userId: string;
  decision: VoteDecision;
  comment?: string;
}

class VotingService {
  // Local state for mock data
  private resolutions: Resolution[] = [...mockResolutions];

  /**
   * Calculate voting result for a resolution
   */
  private calculateVotingResult(votes: Vote[], votingRule: VotingRule): VotingResult {
    const totalEligibleVoters = mockUsers.filter(user =>
      user.role === UserRole.BOARD_MEMBER ||
      user.role === UserRole.CHAIRPERSON ||
      user.role === UserRole.ADMIN
    ).length;

    const totalVotes = votes.length;
    const yesVotes = votes.filter(v => v.decision === VoteDecision.YES).length;
    const noVotes = votes.filter(v => v.decision === VoteDecision.NO).length;
    const abstainVotes = votes.filter(v => v.decision === VoteDecision.ABSTAIN).length;

    const percentageYes = totalVotes > 0 ? (yesVotes / totalVotes) * 100 : 0;
    const percentageNo = totalVotes > 0 ? (noVotes / totalVotes) * 100 : 0;
    const percentageAbstain = totalVotes > 0 ? (abstainVotes / totalVotes) * 100 : 0;

    const quorumMet = totalVotes >= Math.ceil(totalEligibleVoters * 0.5);

    let isPassed = false;
    let requiredVotes = 0;

    switch (votingRule) {
      case VotingRule.SIMPLE_MAJORITY:
        requiredVotes = Math.ceil(totalVotes / 2);
        isPassed = yesVotes > noVotes && quorumMet;
        break;
      case VotingRule.TWO_THIRDS:
        requiredVotes = Math.ceil(totalVotes * (2 / 3));
        isPassed = yesVotes >= requiredVotes && quorumMet;
        break;
      case VotingRule.UNANIMOUS:
        requiredVotes = totalVotes;
        isPassed = yesVotes === totalVotes && totalVotes > 0 && quorumMet;
        break;
      case VotingRule.QUORUM_ONLY:
        requiredVotes = Math.ceil(totalEligibleVoters * 0.5);
        isPassed = quorumMet;
        break;
    }

    return {
      totalVotes,
      yesVotes,
      noVotes,
      abstainVotes,
      percentageYes,
      percentageNo,
      percentageAbstain,
      isPassed,
      requiredVotes,
      quorumMet,
    };
  }

  /**
   * Get all resolutions with optional filters
   */
  async getResolutions(filters?: ResolutionFilters): Promise<PaginatedResponse<Resolution>> {
    return simulateApiDelay(() => {
      let filteredResolutions = [...this.resolutions];

      // Apply filters
      if (filters?.status) {
        filteredResolutions = filteredResolutions.filter(res => res.status === filters.status);
      }

      if (filters?.votingRule) {
        filteredResolutions = filteredResolutions.filter(res => res.votingRule === filters.votingRule);
      }

      if (filters?.category) {
        filteredResolutions = filteredResolutions.filter(res => res.category === filters.category);
      }

      if (filters?.relatedMeetingId) {
        filteredResolutions = filteredResolutions.filter(res => res.relatedMeetingId === filters.relatedMeetingId);
      }

      if (filters?.startDate) {
        filteredResolutions = filteredResolutions.filter(res => res.createdDate >= filters.startDate!);
      }

      if (filters?.endDate) {
        filteredResolutions = filteredResolutions.filter(res => res.createdDate <= filters.endDate!);
      }

      if (filters?.search) {
        const searchLower = filters.search.toLowerCase();
        filteredResolutions = filteredResolutions.filter(res =>
          res.title.toLowerCase().includes(searchLower) ||
          res.description.toLowerCase().includes(searchLower)
        );
      }

      // Sort by creation date (most recent first)
      filteredResolutions.sort((a, b) => b.createdDate.getTime() - a.createdDate.getTime());

      // Paginate
      const page = filters?.page || 1;
      const pageSize = filters?.pageSize || 10;

      return createPaginatedResponse(filteredResolutions, page, pageSize);
    }, 600);
  }

  /**
   * Get a single resolution by ID
   */
  async getResolutionById(id: string): Promise<Resolution> {
    return simulateApiDelay(() => {
      const resolution = this.resolutions.find(res => res.id === id);

      if (!resolution) {
        throw {
          message: 'Resolution not found',
          code: 'RESOLUTION_NOT_FOUND',
          status: 404,
        };
      }

      return resolution;
    }, 400);
  }

  /**
   * Create a new resolution
   */
  async createResolution(data: CreateResolutionData): Promise<Resolution> {
    return simulateApiDelay(() => {
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

      // Validate voting deadline
      const now = new Date();
      if (data.votingDeadline <= now) {
        throw {
          message: 'Voting deadline must be in the future',
          code: 'INVALID_DEADLINE',
          status: 400,
        };
      }

      const newResolution: Resolution = {
        id: `res-${Date.now()}`,
        title: data.title,
        description: data.description,
        createdBy: currentUser.id || 'usr-001',
        createdDate: new Date(),
        votingDeadline: data.votingDeadline,
        status: ResolutionStatus.DRAFT,
        votingRule: data.votingRule,
        isAnonymous: data.isAnonymous || false,
        votes: [],
        attachments: data.attachments || [],
        category: data.category,
        relatedMeetingId: data.relatedMeetingId,
      };

      this.resolutions.push(newResolution);

      return newResolution;
    }, 800);
  }

  /**
   * Cast a vote on a resolution
   */
  async castVote(resolutionId: string, voteData: CastVoteData): Promise<Vote> {
    return simulateApiDelay(() => {
      const resolution = this.resolutions.find(res => res.id === resolutionId);

      if (!resolution) {
        throw {
          message: 'Resolution not found',
          code: 'RESOLUTION_NOT_FOUND',
          status: 404,
        };
      }

      // Check if resolution is active
      if (resolution.status !== ResolutionStatus.ACTIVE) {
        throw {
          message: 'Voting is not open for this resolution',
          code: 'VOTING_NOT_ACTIVE',
          status: 400,
        };
      }

      // Check if voting deadline has passed
      const now = new Date();
      if (resolution.votingDeadline < now) {
        throw {
          message: 'Voting deadline has passed',
          code: 'VOTING_CLOSED',
          status: 400,
        };
      }

      // Check if user has already voted
      const existingVote = resolution.votes.find(vote => vote.userId === voteData.userId);
      if (existingVote) {
        throw {
          message: 'You have already cast your vote on this resolution',
          code: 'ALREADY_VOTED',
          status: 400,
        };
      }

      // Get user info for non-anonymous voting
      let userName: string | undefined;
      if (!resolution.isAnonymous) {
        const user = mockUsers.find(u => u.id === voteData.userId);
        userName = user ? `${user.firstName} ${user.lastName}` : undefined;
      }

      const newVote: Vote = {
        userId: voteData.userId,
        userName: resolution.isAnonymous ? undefined : userName,
        decision: voteData.decision,
        comment: voteData.comment,
        timestamp: new Date(),
      };

      resolution.votes.push(newVote);

      // Update voting result
      resolution.result = this.calculateVotingResult(resolution.votes, resolution.votingRule);

      return newVote;
    }, 700);
  }

  /**
   * Get voting results for a resolution
   */
  async getVotingResults(resolutionId: string): Promise<VotingResult> {
    return simulateApiDelay(() => {
      const resolution = this.resolutions.find(res => res.id === resolutionId);

      if (!resolution) {
        throw {
          message: 'Resolution not found',
          code: 'RESOLUTION_NOT_FOUND',
          status: 404,
        };
      }

      // Calculate and return current results
      const result = this.calculateVotingResult(resolution.votes, resolution.votingRule);

      // Update resolution result if it's closed
      if (resolution.status === ResolutionStatus.CLOSED) {
        resolution.result = result;
      }

      return result;
    }, 400);
  }

  /**
   * Close a resolution and finalize results
   */
  async closeResolution(resolutionId: string): Promise<Resolution> {
    return simulateApiDelay(() => {
      const resolution = this.resolutions.find(res => res.id === resolutionId);

      if (!resolution) {
        throw {
          message: 'Resolution not found',
          code: 'RESOLUTION_NOT_FOUND',
          status: 404,
        };
      }

      // Check if resolution is active
      if (resolution.status !== ResolutionStatus.ACTIVE) {
        throw {
          message: 'Only active resolutions can be closed',
          code: 'INVALID_STATUS',
          status: 400,
        };
      }

      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

      // Calculate final results
      const finalResult = this.calculateVotingResult(resolution.votes, resolution.votingRule);

      resolution.status = ResolutionStatus.CLOSED;
      resolution.result = finalResult;
      resolution.closedBy = currentUser.id || 'usr-001';
      resolution.closedDate = new Date();

      return resolution;
    }, 800);
  }

  /**
   * Activate a draft resolution to start voting
   */
  async activateResolution(resolutionId: string): Promise<Resolution> {
    return simulateApiDelay(() => {
      const resolution = this.resolutions.find(res => res.id === resolutionId);

      if (!resolution) {
        throw {
          message: 'Resolution not found',
          code: 'RESOLUTION_NOT_FOUND',
          status: 404,
        };
      }

      // Check if resolution is in draft
      if (resolution.status !== ResolutionStatus.DRAFT) {
        throw {
          message: 'Only draft resolutions can be activated',
          code: 'INVALID_STATUS',
          status: 400,
        };
      }

      // Check if deadline is still in the future
      const now = new Date();
      if (resolution.votingDeadline <= now) {
        throw {
          message: 'Voting deadline must be in the future to activate',
          code: 'INVALID_DEADLINE',
          status: 400,
        };
      }

      resolution.status = ResolutionStatus.ACTIVE;

      return resolution;
    }, 600);
  }

  /**
   * Get active resolutions that user hasn't voted on
   */
  async getPendingVotes(userId: string): Promise<Resolution[]> {
    return simulateApiDelay(() => {
      const now = new Date();
      return this.resolutions
        .filter(res =>
          res.status === ResolutionStatus.ACTIVE &&
          res.votingDeadline > now &&
          !res.votes.some(vote => vote.userId === userId)
        )
        .sort((a, b) => a.votingDeadline.getTime() - b.votingDeadline.getTime());
    }, 500);
  }

  /**
   * Get resolutions user has voted on
   */
  async getVotedResolutions(userId: string): Promise<Resolution[]> {
    return simulateApiDelay(() => {
      return this.resolutions
        .filter(res => res.votes.some(vote => vote.userId === userId))
        .sort((a, b) => b.createdDate.getTime() - a.createdDate.getTime());
    }, 500);
  }

  /**
   * Update a draft resolution
   */
  async updateResolution(
    resolutionId: string,
    data: Partial<CreateResolutionData>
  ): Promise<Resolution> {
    return simulateApiDelay(() => {
      const resolution = this.resolutions.find(res => res.id === resolutionId);

      if (!resolution) {
        throw {
          message: 'Resolution not found',
          code: 'RESOLUTION_NOT_FOUND',
          status: 404,
        };
      }

      // Check if resolution can be updated
      if (resolution.status !== ResolutionStatus.DRAFT) {
        throw {
          message: 'Only draft resolutions can be updated',
          code: 'INVALID_STATUS',
          status: 400,
        };
      }

      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

      // Update resolution
      Object.assign(resolution, {
        ...data,
        modifiedBy: currentUser.id || 'usr-001',
        modifiedDate: new Date(),
      });

      return resolution;
    }, 700);
  }

  /**
   * Delete a draft resolution
   */
  async deleteResolution(resolutionId: string): Promise<{ success: boolean; message: string }> {
    return simulateApiDelay(() => {
      const resolutionIndex = this.resolutions.findIndex(res => res.id === resolutionId);

      if (resolutionIndex === -1) {
        throw {
          message: 'Resolution not found',
          code: 'RESOLUTION_NOT_FOUND',
          status: 404,
        };
      }

      const resolution = this.resolutions[resolutionIndex]!;

      // Check if resolution can be deleted
      if (resolution.status !== ResolutionStatus.DRAFT) {
        throw {
          message: 'Only draft resolutions can be deleted',
          code: 'INVALID_STATUS',
          status: 400,
        };
      }

      this.resolutions.splice(resolutionIndex, 1);

      return {
        success: true,
        message: 'Resolution deleted successfully',
      };
    }, 600);
  }

  /**
   * Archive a closed resolution
   */
  async archiveResolution(resolutionId: string): Promise<Resolution> {
    return simulateApiDelay(() => {
      const resolution = this.resolutions.find(res => res.id === resolutionId);

      if (!resolution) {
        throw {
          message: 'Resolution not found',
          code: 'RESOLUTION_NOT_FOUND',
          status: 404,
        };
      }

      // Check if resolution can be archived
      if (resolution.status !== ResolutionStatus.CLOSED) {
        throw {
          message: 'Only closed resolutions can be archived',
          code: 'INVALID_STATUS',
          status: 400,
        };
      }

      resolution.status = ResolutionStatus.ARCHIVED;

      return resolution;
    }, 500);
  }

  /**
   * Get resolution statistics
   */
  async getResolutionStatistics(): Promise<{
    total: number;
    active: number;
    closed: number;
    passed: number;
    failed: number;
    averageParticipation: number;
  }> {
    return simulateApiDelay(() => {
      const total = this.resolutions.length;
      const active = this.resolutions.filter(res => res.status === ResolutionStatus.ACTIVE).length;
      const closed = this.resolutions.filter(res => res.status === ResolutionStatus.CLOSED).length;
      
      const closedResolutions = this.resolutions.filter(res => res.status === ResolutionStatus.CLOSED);
      const passed = closedResolutions.filter(res => res.result?.isPassed).length;
      const failed = closedResolutions.filter(res => !res.result?.isPassed).length;

      const totalEligibleVoters = mockUsers.filter(user =>
        user.role === UserRole.BOARD_MEMBER ||
        user.role === UserRole.CHAIRPERSON ||
        user.role === UserRole.ADMIN
      ).length;

      const totalVotes = this.resolutions.reduce((sum, res) => sum + res.votes.length, 0);
      const averageParticipation = total > 0 && totalEligibleVoters > 0
        ? (totalVotes / (total * totalEligibleVoters)) * 100
        : 0;

      return {
        total,
        active,
        closed,
        passed,
        failed,
        averageParticipation,
      };
    }, 400);
  }
}

export default new VotingService();
