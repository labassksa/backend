// //Verify the user's role against the required roles for accessing specific endpoints.
// import { Request, Response, NextFunction } from "express";
// import { Roles } from '../../types/roles';
// import { RoleSpecification } from "typeorm";

// // Custom error type for unauthorized access
// class UnauthorizedError extends Error {
//   constructor(message: string) {
//     super(message);
//     this.name = "UnauthorizedError";
//   }
// }

// /**
//  * Role checking middleware generator. Returns a middleware that checks if the request user has one of the specified roles.
//  * @param requiredRoles An array of strings representing the roles that are allowed to access the route.
//  * @returns An Express middleware function.
//  */
// export function checkRole(requiredRoles: (keyof typeof Roles)[]) {
//   return function (req: Request, res: Response, next: NextFunction) {
//     try {
//       // Assuming 'req.user' is populated from previous authentication middleware
//       if (!req.user || !req.user.role) {
//         throw new UnauthorizedError("Authentication required");
//       }

//       const { role } = req.user; // Assuming the user object has a 'role' property

//       // Use the Roles enumeration to check for required roles
//       if (!requiredRoles.includes()) {
//         throw new UnauthorizedError(
//           "You do not have permission to access this resource"
//         );
//       }

//       next(); // User has the required role, proceed to the next middleware
//     } catch (error) {
//       if (error instanceof UnauthorizedError) {
//         res.status(403).json({ message: error.message });
//       } else {
//         // Handle unexpected errors differently
//         console.error(
//           "An unexpected error occurred in checkRole middleware:",
//           error
//         );
//         res.status(500).json({ message: "Internal server error" });
//       }
//     }
//   };
// }
