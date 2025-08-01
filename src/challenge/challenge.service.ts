// src/challenge/challenge.service.ts
import {
  Injectable,
  NotFoundException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateChallengeDto } from './dto/challenge.dto';

@Injectable()
export class ChallengeService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createChallengeDto: CreateChallengeDto, userId: string) {
    return this.prisma.challenge.create({
      data: {
        ...createChallengeDto,
        creatorId: userId,
      },
    });
  }

  async findAllPublic() {
    return this.prisma.challenge.findMany({
      where: { isPublic: true },
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { participants: true },
        },
      },
    });
  }

  async findOne(id: string) {
    const challenge = await this.prisma.challenge.findUnique({
      where: { id },
      include: {
        participants: {
          select: {
            id: true,
            user: {
              select: { id: true, username: true },
            },
            progress: true,
            completed: true,
          },
        },
      },
    });

    if (!challenge) {
      throw new NotFoundException(`Challenge with ID "${id}" not found.`);
    }
    return challenge;
  }

  async joinChallenge(challengeId: string, userId: string) {
    const challengeExists = await this.prisma.challenge.findUnique({
      where: { id: challengeId },
    });
    if (!challengeExists) {
      throw new NotFoundException(
        `Challenge with ID "${challengeId}" not found.`,
      );
    }

    // CORRECTED: Use findUnique on the compound key for an accurate check.
    const alreadyJoined = await this.prisma.userChallenge.findUnique({
      where: { userId_challengeId: { userId, challengeId } },
    });
    if (alreadyJoined) {
      throw new ConflictException('You have already joined this challenge.');
    }

    return this.prisma.userChallenge.create({
      data: {
        userId,
        challengeId,
      },
    });
  }

  async findUserChallenges(userId: string) {
    return this.prisma.userChallenge.findMany({
      where: { userId },
      include: {
        challenge: true,
      },
      orderBy: { joinedAt: 'desc' },
    });
  }

  async updateUserChallengeProgress(
    userChallengeId: string,
    progress: number,
    userId: string,
  ) {
    const userChallenge = await this.prisma.userChallenge.findUnique({
      where: { id: userChallengeId },
    });

    if (!userChallenge) {
      throw new NotFoundException(
        `Challenge participation with ID "${userChallengeId}" not found.`,
      );
    }
    if (userChallenge.userId !== userId) {
      throw new ForbiddenException(
        'You do not have permission to update this challenge progress.',
      );
    }

    return this.prisma.userChallenge.update({
      where: { id: userChallengeId },
      data: { progress },
    });
  }

  async leaveChallenge(userChallengeId: string, userId: string) {
    const userChallenge = await this.prisma.userChallenge.findUnique({
      where: { id: userChallengeId },
    });

    if (!userChallenge) {
      throw new NotFoundException(
        `Challenge participation with ID "${userChallengeId}" not found.`,
      );
    }
    if (userChallenge.userId !== userId) {
      throw new ForbiddenException(
        'You do not have permission to leave this challenge.',
      );
    }

    await this.prisma.userChallenge.delete({
      where: { id: userChallengeId },
    });
  }
}
