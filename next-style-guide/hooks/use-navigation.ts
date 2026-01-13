import {
  useParams,
  usePathname,
  useRouter,
  useSelectedLayoutSegments,
} from "next/navigation";

export function useNavigation() {
  return {
    pathname: usePathname(),
    params: useParams(),
    router: useRouter(),
    selectedLayoutSegments: useSelectedLayoutSegments(),
  };
}
