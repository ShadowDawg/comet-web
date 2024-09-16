// types/user.ts

export interface AstroDataModel {
    dailyHoroscope: string;
    detailedReading: string;
    matchUid: string;
    matchApproved: boolean;
    lastUpdated: string;
    chatRoomId: string;
    planetSigns: Record<string, any>;
    actionTable: {
      yes: string[];
      no: string[];
    };
  }
  
  export interface UserModel {
    uid: string;
    email: string;
    name: string;
    dateOfBirth: string;
    placeOfBirth: string;
    photoUrl: string;
    gender: string;
    handle: string;
    phoneNumber: string;
    notificationsEnabled: boolean;
    fcmToken?: string;
    astroData: AstroDataModel;
  }
  
  export function parseDate(date: string | number): Date {
    if (typeof date === 'string') {
      return new Date(date);
    } else if (typeof date === 'number') {
      return new Date(date);
    } else {
      return new Date();
    }
  }
  
  export function createUserModel(data: Partial<UserModel>): UserModel {
    return {
      uid: data.uid || '',
      email: data.email || '',
      name: data.name || '',
      dateOfBirth: data.dateOfBirth || '',
      placeOfBirth: data.placeOfBirth || '',
      photoUrl: data.photoUrl || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQWqPhrfTFyCACSkoLLy3NHfEBRNh6xgD-zmw&s',
      gender: data.gender || '',
      handle: data.handle || '',
      phoneNumber: data.phoneNumber || '',
      notificationsEnabled: data.notificationsEnabled ?? false,
      fcmToken: data.fcmToken,
      astroData: createAstroDataModel(data.astroData || {}),
    };
  }
  
  export function createAstroDataModel(data: Partial<AstroDataModel>): AstroDataModel {
    return {
      dailyHoroscope: data.dailyHoroscope || '',
      detailedReading: data.detailedReading || '',
      matchUid: data.matchUid || '',
      matchApproved: data.matchApproved ?? false,
      lastUpdated: data.lastUpdated || new Date().toISOString(),
      chatRoomId: data.chatRoomId || 'hmm',
      planetSigns: data.planetSigns || {},
      actionTable: {
        yes: data.actionTable?.yes || ["Afternoon Naps", "Group Studies", "Bunk Class"],
        no: data.actionTable?.no || ["Usha Cafe", "Gossip", "Masala Dosa"]
      },
    };
  }