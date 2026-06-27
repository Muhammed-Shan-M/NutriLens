import { RegisterInputDto, LoginInputDto, UpdateMetricsInputDto, AuthResponseDto } from '../dtos/Auth.dto';
import { IUserDocument } from '../models/User.model';

export interface IAuthService {
  register(dto: RegisterInputDto): Promise<AuthResponseDto>;
  login(dto: LoginInputDto): Promise<AuthResponseDto>;
  refreshToken(token: string): Promise<{ accessToken: string }>;
  updateMetrics(id: string, dto: UpdateMetricsInputDto): Promise<IUserDocument>;
  completeOnboarding(id: string): Promise<IUserDocument>;
  getCurrentUser(id: string): Promise<IUserDocument>;
}

export default IAuthService;
