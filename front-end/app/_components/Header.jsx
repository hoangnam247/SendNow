'use client'

import { useState, useRef, useEffect } from "react";
import {
  Dialog,
  DialogPanel,
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Popover,
  PopoverButton,
  PopoverGroup,
  PopoverPanel,
} from '@headlessui/react'
import {
  ChartBarIcon  ,
  ArrowPathIcon,
  Bars3Icon,
  ChartPieIcon,
  ClipboardDocumentListIcon,
  UsersIcon,
  UserCircleIcon ,
  XMarkIcon,

} from '@heroicons/react/24/outline'
import { ChevronDownIcon, PhoneIcon, PlayCircleIcon } from '@heroicons/react/20/solid'
import Image from "next/image";
import { useToken } from '@/app/contexts/TokenContext';
import Image from 'next/image';

const products = [
  { name: 'Tổng quan', description: 'Khám phá các chỉ số và dữ liệu quan trọng để hiểu khách hàng của doanh nghiệp.', href: '/audience/overview', icon: ChartBarIcon },
  { name: 'Dach sách', description: 'Danh sách khách hàng ', href: '/lists', icon: ClipboardDocumentListIcon },
  { name: 'Liên hệ', description: 'Danh sách các liên hệ', href: '/lists', icon: UsersIcon },
]


export default function Example() {
  const { user } = useToken();   
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  
  // Hàm toggle dropdown
  const toggleDropdown = () => {
    setOpenDropdown(!openDropdown);
  };
  
  return (
<header className="bg-white shadow w-full sticky top-0 left-0 z-50">
<nav aria-label="Global" className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8">
        <div className="flex lg:flex-1">
          <a href="/" className="-m-1.5 p-1.5"> 
            <span className="sr-only">ZoZo</span>
            <Image
              src="/images/zozo.png" // Đường dẫn tuyệt đối từ thư mục public
              alt="ZoZo Logo"
              width={100} // Đặt kích thước ảnh
              height={100}
            />
          </a>
        </div>
        <div className="flex lg:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon aria-hidden="true" className="size-6" />
          </button>
        </div>

        {user ? (
        <PopoverGroup className="hidden lg:flex lg:gap-x-12">
        <a href="/overview" className="text-lg font-semibold text-gray-900 hover:text-orange-600 transition">
            Tổng quan
        </a>
        <a href="/campaigns" className="text-lg font-semibold text-gray-900 hover:text-orange-600 transition">
            Chiến dịch
        </a>
          <Popover className="relative">
            <PopoverButton className="flex items-center gap-x-1 text-lg font-semibold text-gray-900 hover:text-orange-600 transition">
              Khách hàng
              <ChevronDownIcon aria-hidden="true" className="size-5 flex-none text-gray-400" />
            </PopoverButton>

            <PopoverPanel
              transition
              className="absolute -left-8 top-full z-10 mt-3 w-screen max-w-md overflow-hidden rounded-3xl bg-white shadow-lg ring-1 ring-gray-900/5 transition data-[closed]:translate-y-1 data-[closed]:opacity-0 data-[enter]:duration-200 data-[leave]:duration-150 data-[enter]:ease-out data-[leave]:ease-in"
            >
              <div className="p-4">
                {products.map((item) => (
                  <div
                    key={item.name}
                    className="group relative flex items-center gap-x-6 rounded-lg p-4 text-sm/6 hover:bg-gray-50"
                  >
                    <div className="flex size-11 flex-none items-center justify-center rounded-lg bg-gray-50 group-hover:bg-white">
                      <item.icon aria-hidden="true" className="size-6 text-gray-600 group-hover:text-indigo-600" />
                    </div>
                    <div className="flex-auto">
                      <a href={item.href} className="block font-semibold text-gray-900">
                        {item.name}
                        <span className="absolute inset-0" />
                      </a>
                      <p className="mt-1 text-gray-600">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            
            </PopoverPanel>
          </Popover>
        </PopoverGroup>
        ) : (
          <PopoverGroup className="hidden lg:flex lg:gap-x-12">
          <a href="/overview" className="text-lg font-semibold text-gray-900 hover:text-orange-600 transition">
              Bảng giá
          </a>
          <a href="/campaigns" className="text-lg font-semibold text-gray-900 hover:text-orange-600 transition">
             Hướng dẫn
          </a>
          <a href="/campaigns" className="text-lg font-semibold text-orange-600 hover:text-gray-900 transition">
             Dùng thử
          </a>
          <a href="/campaigns" className="text-lg font-semibold text-gray-900 hover:text-orange-600 transition">
             Cộng đồng Email marketing
          </a>
          </PopoverGroup>
        )}
        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
        {user ? (        
          <span className="text-lg flex items-center">
            <UserCircleIcon className="h-8 w-8 text-gray-500 mr-2" /> {/* `mr-2` tạo khoảng cách giữa icon và tên */}
            {user.name}
          </span>

          ) : (
            <a href="/auth/login" className="text-lg font-semibold text-gray-900 hover:text-orange-600 transition ">
            Đăng Nhập
          </a>
          )}
        </div>
      </nav>

      <Dialog open={mobileMenuOpen} onClose={setMobileMenuOpen} className="lg:hidden">
        <div className="fixed inset-0 z-10" />
        <DialogPanel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <a href="#" className="-m-1.5 p-1.5">
              <span className="sr-only">Your Company</span>
              <Image
                alt=""
                src="https://tailwindui.com/plus/img/logos/mark.svg?color=indigo&shade=600"
                className="h-8 w-auto"
              />
            </a>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="-m-2.5 rounded-md p-2.5 text-gray-700"
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon aria-hidden="true" className="size-6" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10">
              <div className="space-y-2 py-6">
              <a
                  href="/overview"
                  className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
                >
                Tổng quan                
                </a>
                <a
                  href="/campaigns"
                  className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
                >
                Chiến dịch
                </a>
                <Disclosure as="div" className="-mx-3">                
                  <DisclosureButton className="group flex w-full items-center justify-between rounded-lg py-2 pl-3 pr-3.5 text-base/7 font-semibold text-gray-900 hover:bg-gray-50">
                    Khách hàng
                    <ChevronDownIcon aria-hidden="true" className="size-5 flex-none group-data-[open]:rotate-180" />
                  </DisclosureButton>
                  <DisclosurePanel className="mt-2 space-y-2">
                    {[...products].map((item) => (
                      <DisclosureButton
                        key={item.name}
                        as="a"
                        href={item.href}
                        className="block rounded-lg py-2 pl-6 pr-3 text-sm/7 font-semibold text-gray-900 hover:bg-gray-50"
                      >
                        {item.name}
                      </DisclosureButton>
                    ))}
                  </DisclosurePanel>
                </Disclosure>

              </div>
              <div className="py-6">
                {user ? (
                    <span className="text-sm">{user.name}</span>
                ) : (
                  <a
                  href="#"
                  className="-mx-3 block rounded-lg px-3 py-2.5 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
                >
                  Đăng Nhập
                </a>
                )}
              </div>
            </div>
          </div>
        </DialogPanel>
      </Dialog>
    </header>
  )
}