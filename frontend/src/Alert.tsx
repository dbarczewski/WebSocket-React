import { Transition } from '@headlessui/react';
import { Fragment } from 'react';

function Alert({ show, type }: any) {
  const renderSuccess = () => (
    <div
      className="bg-green-200 border-green-600 text-green-600 border-l-4 p-4 absolute bottom-2 left-2"
      role="alert"
    >
      <p className="font-bold">Connected</p>
      <p>You are connected to the server!</p>
    </div>
  );
  const renderError = () => (
    <div
      className="bg-red-200 border-red-600 text-red-600 border-l-4 p-4 absolute bottom-2 left-2"
      role="alert"
    >
      <p className="font-bold">Error</p>
      <p>There seems to be an issue with your connection.</p>
    </div>
  );

  const renderAlert = () => {
    switch (type) {
      case 'Open':
        return renderSuccess();
      case 'Closed':
      case 'Closing':
        return renderError();
      case 'Connecting':
        return renderError();
      default:
        console.error(`Alert type ${type} is not defined`);
        return <div></div>;
    }
  };

  return (
    <Transition
      show={show}
      appear={true}
      as={Fragment}
      enter="transition ease-in-out duration-1000 transform"
      enterFrom="-translate-x-full"
      enterTo="translate-x-0"
      leave="transition ease-in-out duration-1000 transform"
      leaveFrom="translate-x-0"
      leaveTo="-translate-x-full"
    >
      {renderAlert()}
    </Transition>
  );
}

export default Alert;
