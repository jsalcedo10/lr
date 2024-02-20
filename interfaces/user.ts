export interface IUser {
    Id                    : number;
    Name                  : string;
    UserName              : string;
    Password              : string;
    Position              : string;
    IsAdmin               : number;
    IsEmployee            : number;
    IsExternal            : number;
    CreatedAt?            : string;
    Active                : number;
    Department            : string;
    Department_Id         : number;
    isLoggedIn            : boolean;
    Email                 : string;
    Entity_Id             : number;
    Position_Id           : number;
    IncidenceNotification : number;
    ContractNotification  : number;
    Entity                : string;
    EmployeeNumber        : string;
}