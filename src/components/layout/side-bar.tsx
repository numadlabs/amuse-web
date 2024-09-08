// import React from "react";
// import SidebarItem from "../ui/sidebar-Item";
// import {
//   ChartSquare,
//   TicketStar,
//   Setting2,
//   ArrowUp2,
//   ArrowRight2,
//   LogoutCurve,
//   Add,
//   Home2,
//   User,
// } from "iconsax-react";
// import { useRouter } from "next/router";
// import { Button } from "@/components/ui/button";

// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover";
// import Image from "next/image";
// import { useAuth } from "@/lib/context/auth-context";
// import SERVER_SETTINGS from "@/lib/serverSettings";
// import { useEmployeeProfile } from "@/lib/hooks/useEmployeeProfile";
// import { ROLES } from "@/lib/enums";
// import { getReadableRole } from "@/lib/utils";
// import { useSession } from "next-auth/react";
// import { useRestaurantId } from "@/lib/hooks/useRestaurantId";

// const sidebarData = [
//   {
//     icon: ChartSquare,
//     label: "Dashboard",
//     navigation: "/dashboard",
//   },
//   {
//     icon: TicketStar,
//     label: "Rewards",
//     navigation: "/reward",
//   },
//   {
//     icon: Setting2,
//     label: "Settings",
//     navigation: "/settings",
//   },
// ];

// const sidebarEmployeeData = [
//   {
//     icon: Home2,
//     label: "Home",
//     navigation: "/home",
//   },
//   {
//     icon: User,
//     label: "Account",
//     navigation: "/account",
//   },
// ];

// const Sidebar = () => {
//   const router = useRouter();
//   const currentPath = router.pathname;
//   const { onLogout } = useAuth();
//   const { data: session } = useSession();
//   const { data: employeeProfile } = useEmployeeProfile(session?.userId);
//   const { data: restaurant } = useRestaurantId(session?.restaurantId);

//   const signOut = () => {
//     if (onLogout) {
//       const result = onLogout();
//       console.log("success logout", result);
//       // toast.success("Success log out.");
//     }
//   };

//   return (
//     <>
//       <section className="">
//         <div className="fixed mt-0 lg:mt-[81px] w-[288px] h-full lg:px-6 pt-6 lg:border-r border-1 border-gray500 flex flex-col gap-2">
//           {employeeProfile?.role === ROLES.RESTAURANT_WAITER
//             ? sidebarEmployeeData.map((item, index) => (
//                 <SidebarItem
//                   key={index}
//                   label={item.label}
//                   icon={item.icon}
//                   handleNavigation={() => router.push(item.navigation)}
//                   active={currentPath === item.navigation}
//                 />
//               ))
//             : sidebarData.map((item, index) => (
//                 <SidebarItem
//                   key={index}
//                   label={item.label}
//                   icon={item.icon}
//                   handleNavigation={() => router.push(item.navigation)}
//                   active={currentPath === item.navigation}
//                 />
//               ))}
//           <div>
//             <Popover>
//               <PopoverTrigger asChild>
//                 <div className="h-20 w-full flex justify-between items-center border-t border-gray500 bg-transparent absolute bottom-[80px] right-0 pt-5 pr-6 pb-5 lg:pl-5 cursor-pointer">
//                   <div className="flex">
//                     <div className="px-3">
//                       <Image
//                         src={`${SERVER_SETTINGS.IMAGE_CDN}/${restaurant?.restaurant?.logo}`}
//                         alt="Choijin"
//                         width={0}
//                         height={0}
//                         className="w-10 h-10 rounded-[200px] object-cover"
//                         sizes="100%"
//                       />
//                     </div>
//                     <div>
//                       <p className="text-md font-semibold text-gray00">
//                         {restaurant?.restaurant?.name}
//                       </p>
//                       <p className="text-sm font-normal text-gray100">
//                         {getReadableRole(employeeProfile?.role)}
//                       </p>
//                     </div>
//                   </div>
//                   <div>
//                     <ArrowUp2 className="w-5 h-5" color="#9aa2a7" />
//                   </div>
//                 </div>
//               </PopoverTrigger>
//               <PopoverContent className="w-[320px] border-gray400 relative left-6 bottom-6">
//                 <div className="grid gap-4 rounded-xl">
//                   <div className="grid gap-4">
//                     <p className="text-md font-semibold text-gray100">
//                       Restaurants
//                     </p>
//                     <div className=" w-[288px] h-16 flex justify-between items-center bg-transparent border border-gray400 rounded-[12px] border-t p-0 lg:p-3">
//                       <div className="flex">
//                         <div className="px-3">
//                           <Image
//                             src={`${SERVER_SETTINGS.IMAGE_CDN}/${restaurant?.restaurant?.logo}`}
//                             alt="Choijin"
//                             width={0}
//                             height={0}
//                             className="w-10 h-10 rounded-[200px] object-cover"
//                             sizes="100%"
//                           />
//                         </div>
//                         <div>
//                           <p className="text-md font-bold text-gray00">
//                             {restaurant?.restaurant?.name}
//                           </p>
//                           <p className="text-sm font-normal text-gray100">
//                             {getReadableRole(employeeProfile?.role)}
//                           </p>
//                         </div>
//                       </div>
//                       <div>
//                         <ArrowRight2 className="w-5 h-5" color="#9aa2a7" />
//                       </div>
//                     </div>
//                     {employeeProfile?.role !== ROLES.RESTAURANT_WAITER && (
//                       <>
//                         <Button
//                           variant={"disabled"}
//                           size={"icon"}
//                           className="w-[161px] h-10 m-auto border border-gray400 bg-transparent text-sm2 rounded-[48px] text-gray100"
//                         >
//                           <Add size="16" className="text-gray00" />
//                           <p className="text-gray00 text-sm2 outline-none">
//                             {" "}
//                             Add restaurant
//                           </p>
//                         </Button>
//                         <span className="absolute right-0 bottom-[27%] w-full border border-gray400 h-0"></span>
//                       </>
//                     )}
//                   </div>
//                   <Button
//                     variant={"secondary"}
//                     size={"icon"}
//                     className="w-full bg-gray400 mt-4"
//                     onClick={signOut}
//                   >
//                     <span className="mr-[6px]">
//                       <LogoutCurve size="16" color="#ffffff" />
//                     </span>
//                     <span className="text-sm2">Log out</span>
//                   </Button>
//                 </div>
//               </PopoverContent>
//             </Popover>
//           </div>
//         </div>
//       </section>
//     </>
//   );
// };

// export default Sidebar;
