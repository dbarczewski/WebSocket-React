import { useEffect, useRef, useState } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import Alert from './Alert';

function BuyTable({ user }: any) {
  const field = useRef<any[]>([]);
  const [selectedPosition, setSelectedPosition] = useState<number[]>([]);
  const [showAlert, setShowAlert] = useState(false);
  const handleMessage = (data: any) => {
    data = JSON.parse(data.data);
    switch (data.type) {
      case 'field':
        field.current = data.content;
        break;

      default:
        break;
    }
  };
  const { readyState, sendJsonMessage } = useWebSocket(
    `ws://localhost:3001?user=${user}`,
    {
      onMessage: handleMessage,
      shouldReconnect: (closeEvent) => true,
    },
  );

  useEffect(() => {
    const msg = {
      event: 'field',
    };
    sendJsonMessage(msg);
  }, [sendJsonMessage]);

  useEffect(() => {
    setShowAlert(true);
    let showAlertTimeout: NodeJS.Timeout;
    if (readyState === 1) {
      showAlertTimeout = setTimeout(() => {
        setShowAlert(false);
      }, 3000);
    }

    return () => {
      clearTimeout(showAlertTimeout);
    };
  }, [readyState]);

  const handleBuy = () => {
    const msg = {
      event: 'buy',
      data: {
        pos: selectedPosition,
      },
    };
    sendJsonMessage(msg);
  };

  const renderCart = () => {
    return (
      <div>
        {selectedPosition.length === 0 ? (
          <div>Select your Ticket!</div>
        ) : (
          <div>
            <h5>Your selected tickets:</h5>1 x{' '}
            <span className="bg-indigo-600 rounded-xl text-gray-100 px-2 py-1">
              {selectedPosition[0]}-{selectedPosition[1]}
            </span>{' '}
            = 5€
            <hr className="my-2" />
            <button
              type="button"
              className="py-2 px-4  bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500 focus:ring-offset-indigo-200 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg "
              onClick={handleBuy}
            >
              Buy
            </button>
          </div>
        )}
      </div>
    );
  };

  const renderCell = (type: number, position: number[]) => {
    const color = ['bg-green-500', 'bg-red-500', 'bg-blue-500'][type];
    return (
      <div
        className={`w-10 h-10 ${color} flex justify-center items-center select-none rounded-t-xl mx-auto 
        ${type === 0 ? 'cursor-pointer' : ''} ${
          position[0] === selectedPosition[0] &&
          position[1] === selectedPosition[1]
            ? 'border-4 border-blue-500'
            : ''
        }`}
      >
        {position[0]}-{position[1]}
      </div>
    );
  };

  const connectionStatus = {
    [ReadyState.CONNECTING]: 'Connecting',
    [ReadyState.OPEN]: 'Open',
    [ReadyState.CLOSING]: 'Closing',
    [ReadyState.CLOSED]: 'Closed',
    [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
  }[readyState];

  return (
    <div>
      <div className="relative max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-lg mx-auto rounded-lg shadow-lg overflow-hidden lg:max-w-none lg:flex lg:justify-between">
          <div className="bg-white dark:bg-gray-800 px-6 py-8  w-full lg:flex-shrink-1 lg:p-12">
            <div className="space-y-2 text-gray-800">
              <h3 className="text-3xl">
                <span className="text-gray-500">Event:</span> Lorem Ipsum
              </h3>
              <p>
                <span className="text-gray-500">Date:</span> 26.05.2021 - 18:45
              </p>
              <p>
                <span className="text-gray-500">Description:</span> Lorem ipsum
                dolor sit amet, consetetur sadipscing elitr, sed diam nonumy
                eirmod tempor invidunt ut labore et dolore magna aliquyam erat,
                sed diam voluptua. At vero eos et accusam et justo duo dolores
                et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus
                est.
              </p>
            </div>
            <hr className="w-full my-4" />
            <div className="w-full relative">
              <div className="absolute top-4 left-4 space-y-2">
                Legend
                <div className="flex flex-row items-center">
                  <div className="w-6 h-6 bg-green-500 rounded-t mr-2" /> - FREE
                </div>
                <div className="flex flex-row items-center">
                  <div className="w-6 h-6 bg-red-500 rounded-t mr-2" /> -
                  RESERVED
                </div>
                <div className="flex flex-row items-center">
                  <div className="w-6 h-6 bg-blue-500 rounded-t mr-2" /> - YOURS
                </div>
                <div className="flex flex-row items-center">
                  <div className="w-6 h-6 bg-green-500 border-2 border-blue-500 rounded-t mr-2" />{' '}
                  - SELECTED
                </div>
              </div>
              <div className="mx-auto grid grid-cols-2 gap-4 w-64 ">
                {field?.current &&
                  field.current.map((row: any[], index) => {
                    return row.map((cell, index2) => (
                      <div
                        key={`${index}-${index2}`}
                        onClick={() =>
                          cell === 0
                            ? setSelectedPosition([index, index2])
                            : null
                        }
                      >
                        {renderCell(cell, [index, index2])}
                      </div>
                    ));
                  })}
              </div>
            </div>
          </div>
          <div className="py-8 px-6 text-center bg-gray-50 dark:bg-gray-700 lg:flex-shrink-0 lg:flex lg:flex-col lg:justify-center lg:p-12">
            {renderCart()}
          </div>
        </div>
      </div>
      <Alert show={showAlert} type={connectionStatus} />
    </div>
  );
}

export default BuyTable;
