type popup = {
  state:boolean,
  message?:any,
  subMessage?:any
}
type errorData = {
  state: boolean,
  message: string,
  alertType?: number,
  buttonText? : string,
  headerText? : string
}

type OrgReqHeaders = {
  limit?: number,
  organization_ids?:any,
  organization_name?:string,
  last_id?: number,
  page_number?: number,
  query_type: number
}

type orgEditPayload = {

  parent_organization_id?:any,
  organization_name?:string,
  organization_id?:any,
  status?:number

}

type communityReqheaders = {
  organization_id?: any,
  limit?: number,
  page_number?: number,
  community_ids?: any,
  last_id?: number,
  community_name?: string,
  query_type: number
}

type addressListPayload = {
  limit?: number,
  last_id?: number,
  page_number?: number,
  state_ids?:any
}

type countryListPayload = {
  limit?: number,
  last_id?: number,
  page_number?: number,
}

type stateListPayload = {
  limit?: number,
  last_id?: number,
  page_number?: number,
  country_id?: any,
  state_name?: string
}

type timezonePayload = {
  timezone_id? :any
}

type userListPayload = {
  user_id?:any
  limit?: number,
  last_id?: number,
  page_number?: number,
  user_ids?:any,
  organization_ids?:any,
  organization_name?:string,
  community_ids?:any,
  community_name?:string,
  name?:string,
  role_id?:any,
  email_id?:string,
  list_type:number,
  query_type: number
}
type hostListPayload = {
  community_id: number,
  is_zoom_game: number,
  email_id?: string,
  host_list_query?: string,
  limit?:number,
  page_number?:number
}

type userEditPayload = {
  user_id?:any,
  first_name?:string,
  last_name?:string,
  gender?:any
  birth_year?:number,
  phone_number?:number,
  email_id?:string,
  agreement?:any,
  sales_force_id?:number,
  user_comm_role?:any
  status?:number
}

type licenseListPayload = {
  limit?: number,
  last_id?: number,
  page_number?: number,
  community_name?:any
  community_ids?:any
  organization_name?:string
  organization_ids?:any
  license_number?:any
  license_ids?:any
  list_type:number
}

type gameListPayload = {
  limit?: number,
  last_id?: number,
  page_number?: number,
  game_ids?:any,
  game_name?:string,
  community_id?: any
}

type planlistPayload = {
  limit?: number,
  last_id?: number,
  page_number?: number,
  pricing_plan_ids?:any,
  game_ids?:any,
  plan_name?:string
}

type roleListPayload = {
  limit?: number,
  last_id?: number,
  page_number?: number,
  role_ids?:any,
  role_name?:string
}

type puzzleCategoryPayload = {
  limit?: number,
  last_id?: number,
  page_number?: number,
  puzzle_category_ids?:any,
  game_ids?:any,
  game_name?:string,
  category_name?: string
}

type gameListPayload = {
  limit?: number,
  last_id?: number,
  page_number?: number,
  game_ids?:any,
  game_name?:string
}

type puzzlePayload = {
  game_level?: any,
  puzzle_category_id?: any,
  limit?:number,
  page_number?:number,
  last_id?:number,
  game_id?:any,
  game_levels?:any

}
type puzzleReportPayload = {
  puzzle_category_ids?:any,
  puzzle_id?:any,
  game_ids?:any,
  game_levels?:any,
  limit ?:number,
  page_number?:number

}

type gameLevelPayload = {
  game_level_name?:string
}

type gameSchedulePayload = {
  from_date?: any,
  to_date?:any,
  organization_ids?:any,
  community_ids?:any,
  limit?:number,
  last_id?:number,
  page_number?:number,
  game_schedule_id?:any,
  query_type : number
}

type gameScheduleAddOrEditPayload = {
  game_schedule_id?:any,
  community_id?:number,
  game_id?:number,
  schedule_start_at?:any,
  host_id?:number,
  meeting_id?:number,
  zoom_link?:string,
  custom_spinner_space?:number,
  game_level?:number,
  player_one_id?:number,
  player_one_name?:string,
  player_two_id?:number,
  player_two_name?:string,
  player_three_id?:number,
  player_three_name?:string,
  player_four_id?:number,
  player_four_name?:string,
  is_zoom_game:number,
  join_link?: string
}

type gameSchPuzzleCategoryPayload = {
  game_schedule_id:any,
  puzzle_category_ids?:any,
  limit?: number,
  last_id?: number,
  page_number?: number,
}

type element = {
  puzzle_id:number,
  game_level?:number,
  game_level_name?:string,
  words?:any
}

type gamePlayedPayload = {
  player_id:number | string,
  limit?: number,
  last_id?: number,
  page_number?: number,
  game_ids?:any
}

type rateHostPayload = {
  game_schedule_id: number | string,
  community_id: number | string,
  engagement_rate: number,
  knowledge_rate: number,
  recommend: string,
  comments?: string

}


type roleReportPayload = {
  organization_ids?:any,
  community_ids?:any,
  role_ids?:any,
  limit?:number,
  last_id?:number,
  page_number?:number
}
