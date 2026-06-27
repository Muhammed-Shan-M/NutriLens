import { UpdateProfileInputDto, ProfileResponseDto } from '../dtos/Profile.dto';

export interface IProfileService {
  getProfile(userId: string): Promise<ProfileResponseDto>;
  updateProfile(userId: string, dto: UpdateProfileInputDto): Promise<ProfileResponseDto>;
}
