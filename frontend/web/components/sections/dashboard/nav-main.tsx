'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, type LucideIcon } from 'lucide-react';

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@/components/ui/sidebar';

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon: LucideIcon;
    isActive?: boolean;
    items?: {
      title: string;
      url: string;
      icon?: LucideIcon;
    }[];
  }[];
}) {
  const pathname = usePathname();

  const isSubActive = (subItem: { url: string }) => {
    if (subItem.url === pathname) return true;
    const hasExactSiblingMatch = items.some((item) =>
      item.items?.some((sibling) => sibling.url === pathname)
    );
    if (
      !hasExactSiblingMatch &&
      subItem.url !== '/dashboard/farmer' &&
      pathname.startsWith(subItem.url + '/')
    ) {
      return true;
    }
    return false;
  };

  const isMainActive = (item: (typeof items)[number]) => {
    if (item.items?.length) {
      return item.items.some((subItem) => isSubActive(subItem));
    }
    if (item.url === pathname) return true;
    if (item.url !== '/dashboard/farmer' && pathname.startsWith(item.url + '/')) return true;
    return false;
  };

  return (
    <SidebarGroup key={pathname}>
      <SidebarGroupLabel className="text-white">Menu Utama</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <Collapsible
            key={item.title}
            asChild
            defaultOpen={item.isActive || isMainActive(item)}
            className="group/collapsible"
          >
            <SidebarMenuItem>
              {item.items?.length ? (
                // Jika ada sub-item: tombol utama SEKALIGUS trigger collapsible
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton tooltip={item.title} className="cursor-pointer">
                    <item.icon />
                    <span>{item.title}</span>
                    <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
              ) : (
                // Jika tidak ada sub-item: tombol biasa dengan link
                <SidebarMenuButton asChild tooltip={item.title} isActive={isMainActive(item)}>
                  <Link href={item.url}>
                    <item.icon />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              )}

              {item.items?.length ? (
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {item.items.map((subItem) => (
                      <SidebarMenuSubItem key={subItem.title}>
                        <SidebarMenuSubButton asChild isActive={isSubActive(subItem)}>
                          <Link href={subItem.url}>
                            {/* {subItem.icon && (
                              <subItem.icon className="h-4 w-4" />
                            )} */}
                            <span>{subItem.title}</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              ) : null}
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
