import { VehicleProfile } from './vehicle-profile';
import { VehicleState } from './vehicle-state';

export class Vehicle {
  userID: string;
  serialNumber: string;
  imei: string;
  harmanID: string;
  name: string;
  associationID: number;
  associationStatus: string;
  associatedBy: string;
  associatedOn: number;
  modifiedBy: string;
  modifiedOn: number;
  profile: VehicleProfile;
  config: any;
  faults: Array<any>;
  vehicleSystemStatus: any;
  softwareVersion: string;
  trackingData: any = {};
  imageDetails: any;
  state: VehicleState;
  summary: any;
  location: any;

  constructor(vehicle) {
    this.updateVehicle(vehicle);
  }

  public updateVehicle(vehicle) {
    this.userID = vehicle.userID;
    this.serialNumber = vehicle.serialNumber;
    this.imei = vehicle.imei;
    this.harmanID = vehicle.deviceId || vehicle.harmanID;
    this.associationID = vehicle.association_id || vehicle.associationId ||
      vehicle.associationID;
    this.associationStatus = vehicle.associationStatus;
    this.associatedBy = vehicle.associatedBy;
    this.associatedOn = vehicle.associatedOn;
    this.modifiedBy = vehicle.modifiedBy;
    this.modifiedOn = vehicle.modifiedOn;
    this.profile = vehicle.profile;
    this.config = vehicle.config;
    this.faults = vehicle.faults;
    this.vehicleSystemStatus = vehicle.vehicleSystemStatus;
    this.state = vehicle.state || vehicle.associationStatus === 'SUSPENDED' ?
      VehicleState.Suspended : VehicleState.Unknown;
    this.location = vehicle.location || { name: 'GENERIC_TEXT_NA' };
    this.summary = vehicle.summary;
    if (this.summary && this.summary.firmwareVersion &&
        this.summary.firmwareVersion.value) {
      this.softwareVersion = this.summary.firmwareVersion.value;
    } else {
      this.softwareVersion = vehicle.softwareVersion;
    }
    this.name = this.profile && this.profile.nickName ? this.profile.nickName :
      'IMEI ' + this.imei;
  }
}
