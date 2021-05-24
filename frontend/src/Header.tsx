import { Disclosure } from '@headlessui/react';

function Header({ username }: { username: string }) {
  return (
    <Disclosure as="nav" className="bg-gray-800">
      {({ open }: any) => (
        <>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <img
                    className="h-8 w-8"
                    src="https://tailwindui.com/img/logos/workflow-mark-indigo-500.svg"
                    alt="Workflow"
                  />
                </div>
              </div>
              {username ? (
                <div className="ml-4 flex items-center md:ml-6">
                  <div className="max-w-xs bg-gray-800 rounded-full flex items-center text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
                    <span className="text-gray-200 text-2xl pr-4">
                      Hello {username}!
                    </span>

                    <div className="h-8 w-8 rounded-full bg-gray-200 text-center flex justify-center items-center text-xl font-bold">
                      {username.charAt(0)}
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </>
      )}
    </Disclosure>
  );
}
export default Header;
