import {useAuth} from '../context/AuthContext';
export function useRestaurantData(){const {restaurant,loading,error}=useAuth();return {restaurant,loading,error};}
