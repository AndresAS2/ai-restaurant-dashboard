import {supabase} from './supabase';
import {getRegistrationRequests,reviewRegistration} from './restaurantRegistration';

export async function getRestaurants(){
 const {data,error}=await supabase
  .from('restaurants')
  .select('*')
  .order('created_at',{ascending:false});
 if(error)throw error;
 return data||[];
}

export async function getPendingRestaurantRequests(){
 const requests=await getRegistrationRequests();
 return requests.filter(request=>request.status==='pending');
}

export async function approveRestaurantRequest(requestId){
 return reviewRegistration(requestId,'approve');
}

export async function rejectRestaurantRequest(requestId){
 return reviewRegistration(requestId,'reject');
}
