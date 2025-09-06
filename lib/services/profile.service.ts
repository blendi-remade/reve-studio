import { DatabaseService } from './database.service'
import { Profile } from '@/lib/types/domain.types'

export class ProfileService {
  private db: DatabaseService
  
  constructor() {
    this.db = DatabaseService.create()
  }

  async getProfile(userId: string): Promise<Profile | null> {
    return this.db.findById<Profile>('profiles', userId)
  }

  async updateProfile(userId: string, data: Partial<Profile>): Promise<Profile> {
    return this.db.update<Profile>('profiles', userId, data)
  }
}
