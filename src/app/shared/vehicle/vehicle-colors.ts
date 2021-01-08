export enum Colors {
    DEFAULT,
    ORANGE,
    RED,
    MAROON,
    BLUE,
    OLIVE_GREEN,
    BROWN,
    CREAM,
    WHITE,
    LIGHT_GREY,
    DARK_GREY,
    BLACK
  }
  
  export const ColorsBorder = {
    [Colors.DEFAULT]: false,
    [Colors.BLUE]: false,
    [Colors.MAROON]: false,
    [Colors.DARK_GREY]: false,
    [Colors.WHITE]: true,
    [Colors.LIGHT_GREY]: false,
    [Colors.OLIVE_GREEN]: false,
    [Colors.BLACK]: false,
    [Colors.ORANGE]: false,
    [Colors.RED]: false,
    [Colors.BROWN]: false,
    [Colors.CREAM]: false
  };
  
  export const VehicleColorNames: { [key: string]: string } = {
    [Colors.DEFAULT]: 'VEHICLE_PROFILE_YELLOW',
    [Colors.BLUE]: 'VEHICLE_PROFILE_BLUE',
    [Colors.MAROON]: 'VEHICLE_PROFILE_MAROON',
    [Colors.DARK_GREY]: 'VEHICLE_PROFILE_DARK_GREY',
    [Colors.WHITE]: 'VEHICLE_PROFILE_WHITE',
    [Colors.LIGHT_GREY]: 'VEHICLE_PROFILE_LIGHT_GREY',
    [Colors.OLIVE_GREEN]: 'VEHICLE_PROFILE_OLIVE_GREEN',
    [Colors.BLACK]: 'VEHICLE_PROFILE_BLACK',
    [Colors.ORANGE]: 'VEHICLE_PROFILE_ORANGE',
    [Colors.RED]: 'VEHICLE_PROFILE_RED',
    [Colors.BROWN]: 'VEHICLE_PROFILE_BROWN',
    [Colors.CREAM]: 'VEHICLE_PROFILE_CREAM'
  };
  
  export const VehicleColors = {
    [Colors.DEFAULT]: 'rgba(255,206,10,1)',
    [Colors.BLUE]: 'rgba(0,117,196,1)',
    [Colors.MAROON]: 'rgba(154,46,36,1)',
    [Colors.DARK_GREY]: 'rgba(77,77,77,1)',
    [Colors.WHITE]: 'rgba(245,245,245,1)',
    [Colors.LIGHT_GREY]: 'rgba(204,204,204,1)',
    [Colors.OLIVE_GREEN]: 'rgba(128,128,0,1)',
    [Colors.BLACK]: 'rgba(0,0,0,1)',
    [Colors.ORANGE]: 'rgba(251,86,7,1)',
    [Colors.RED]: 'rgba(194,12,21,1)',
    [Colors.BROWN]: 'rgba(111,78,55,1)',
    [Colors.CREAM]: 'rgba(225,198,153,1)'
  };
  
  export const VehicleClasses = {
    [Colors.DEFAULT]: 'default',
    [Colors.BLUE]: 'blue',
    [Colors.MAROON]: 'maroon',
    [Colors.DARK_GREY]: 'darkGrey',
    [Colors.WHITE]: 'white',
    [Colors.LIGHT_GREY]: 'lightGrey',
    [Colors.OLIVE_GREEN]: 'oliveGreen',
    [Colors.BLACK]: 'black',
    [Colors.ORANGE]: 'orange',
    [Colors.RED]: 'red',
    [Colors.BROWN]: 'brown',
    [Colors.CREAM]: 'cream'
  };
  