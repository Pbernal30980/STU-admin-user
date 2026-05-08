import {AssignDriver, Neighborhood, Routes, Stops, User } from "../interfaces/models.interface"
import { DataAssignDriver, DataNeighborhood, DataRoutes, DataStops, DataUsers} from "../interfaces/reponses.interface"

export class GtuMapper{
  static mapDataNeighborhoodToNeighborhood(item:  DataNeighborhood): Neighborhood{
    return {
        id: item.id,
        name: item.name,
      }
  }
  static mapDataNeighborhoodToNeighborhoodArray(items : DataNeighborhood[]): Neighborhood[] {
    return items.map(this.mapDataNeighborhoodToNeighborhood)
  }
  static mapDataStopsToStops(item: DataStops): Stops{
    return {
        id: item.id,
        name: item.name,
        description: item.description,
        neighborhoodId: item.neighborhoodId,
        latitude: item.latitude,
        longitude: item.longitude,
    }
  }

  static mapDataStopsToStopsArray(items : DataStops[]): Stops[] {
    return items.map(this.mapDataStopsToStops)
  }


  static mapDataUsersToUser(item:  DataUsers): User{
    return {
        id: item.id,
        name: item.name,
        email: item.email,
        password: item.password,
        role: item.role,
        status: item.status,
      }
  }
  static mapDataUsersToUserArray(items : DataUsers[]): User[] {
    return items.map(this.mapDataUsersToUser)
  }

  static mapDataAssignDriverToAssignDriver(item:  DataAssignDriver): AssignDriver{
    return {
        id: item.id,
        driverId: item.driverId,
        routeId: item.routeId,
      }
  }
  static mapDataAssignDriverToAssignDriverArray(items : DataAssignDriver[]): AssignDriver[] {
    return items.map(this.mapDataAssignDriverToAssignDriver)
  }

  static mapDataRoutesToRoutes(item: DataRoutes): Routes{
    return {
        id: item.id,
        name: item.name,
        description: item.description,
        startTime: item.startTime,
        endTime: item.endTime,
        neighborhoods: item.neighborhoodIds,
        stops: item.stops,
    }
  }
  static mapDataRoutesToRoutesArray(items : DataRoutes[]): Routes[] {
    return items.map(this.mapDataRoutesToRoutes)
  }
}
