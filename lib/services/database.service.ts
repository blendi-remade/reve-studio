import { createServiceClient } from '@/lib/supabase/service-role'
import { SupabaseClient } from '@supabase/supabase-js'

export class DatabaseService {
  protected supabase: SupabaseClient
  
  protected constructor(supabase: SupabaseClient) {
    this.supabase = supabase
  }

  static create() {
    const supabase = createServiceClient()
    return new DatabaseService(supabase)
  }

  async query<T = any>(
    table: string,
    options?: {
      select?: string
      eq?: Record<string, any>
      limit?: number
      offset?: number
      orderBy?: { column: string; ascending?: boolean }
    }
  ): Promise<T[]> {
    let query = this.supabase
      .from(table)
      .select(options?.select || '*')

    if (options?.eq) {
      Object.entries(options.eq).forEach(([key, value]) => {
        query = query.eq(key, value)
      })
    }

    if (options?.orderBy) {
      query = query.order(options.orderBy.column, { 
        ascending: options.orderBy.ascending ?? false
      })
    }

    if (options?.limit) {
      query = query.limit(options.limit)
    }

    if (options?.offset) {
      query = query.range(
        options.offset, 
        options.offset + (options.limit || 10) - 1
      )
    }

    const { data, error } = await query

    if (error) throw error
    return data as T[]
  }

  async queryWithCount<T = any>(
    table: string,
    options?: {
      select?: string
      eq?: Record<string, any>
      limit?: number
      offset?: number
      orderBy?: { column: string; ascending?: boolean }
      countRelation?: string
    }
  ): Promise<T[]> {
    let query = this.supabase
      .from(table)
      .select(options?.select || '*')

    if (options?.eq) {
      Object.entries(options.eq).forEach(([key, value]) => {
        query = query.eq(key, value)
      })
    }

    if (options?.orderBy) {
      query = query.order(options.orderBy.column, { 
        ascending: options.orderBy.ascending ?? false
      })
    }

    if (options?.limit) {
      query = query.limit(options.limit)
    }

    if (options?.offset) {
      query = query.range(
        options.offset, 
        options.offset + (options.limit || 10) - 1
      )
    }

    const { data, error } = await query

    if (error) throw error
    return data as T[]
  }

  async findById<T = any>(table: string, id: string): Promise<T | null> {
    const { data, error } = await this.supabase
      .from(table)
      .select('*')
      .eq('id', id)
      .maybeSingle()

    if (error) throw error
    return data as T | null
  }

  async insert<T = any>(table: string, data: any): Promise<T> {
    const { data: result, error } = await this.supabase
      .from(table)
      .insert(data)
      .select()
      .single()

    if (error) throw error
    return result as T
  }

  async update<T = any>(table: string, id: string, data: any): Promise<T> {
    const { data: result, error } = await this.supabase
      .from(table)
      .update(data)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return result as T
  }

  async delete(table: string, id: string): Promise<void> {
    const { error } = await this.supabase
      .from(table)
      .delete()
      .eq('id', id)

    if (error) throw error
  }
}