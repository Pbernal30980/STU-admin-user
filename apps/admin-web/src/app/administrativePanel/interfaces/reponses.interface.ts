export interface NeighborhoodResponse {
  message: string;
  data:    DataNeighborhood[];
  status:  number;
}

export interface DataNeighborhood {
  id:   number;
  name: string;
}

export interface StopsResponse{
  message: string;
  data:    DataStops[];
  status:  number;
}

export interface DataStops {
  id:             number;
  name:           string;
  description:    string;
  neighborhoodId: number;
  latitude:       number;
  longitude:      number;
}

export interface RoutesResponse {
  message: string;
  data:    DataRoutes[];
  status:  number;
}

export interface DataRoutes {
  id:              number;
  name:            string;
  description:     string;
  startTime:       string;
  endTime:         string;
  neighborhoodIds: number[];
  stops:           number[];
}

export interface UsersResponse {
  message: string;
  data:    DataUsers[];
  status:  number;
}

export interface DataUsers {
  id:       number;
  name:     string;
  email:    string;
  password: string;
  role:     string;
  status:   string;
}

export interface LoginResponse {
  message: string;
  data:    DataLogin;
  status:  number;

}
export interface DataLogin {

  accessToken: string;
  userId:      number;
  name:        string;
  email:       string;
  role:        string;
}

export interface AssignDriverResponse {
  message: string;
  data:    DataAssignDriver[];
  status:  number;
}

export interface DataAssignDriver {
  id:            number;
  driverId:      number;
  routeId:       number;
  currentStopId: number;
  latestStopId:  number;
  nextStopId:    number;
}
