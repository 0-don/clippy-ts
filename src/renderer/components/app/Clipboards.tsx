import { useEffect, useRef } from 'react';
import { IconName } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import useAppStore from '../../store/AppStore';
import { Clipboard } from '../../../main/prisma/client/index';

dayjs.extend(relativeTime);

type ClipboardProps = {
  star?: boolean | undefined;
  search?: string | undefined;
} & typeof defaultProps;

const defaultProps = {
  star: undefined || false,
  search: undefined || '',
};

function Clipboards({ star, search }: ClipboardProps) {
  const myRef = useRef<HTMLDivElement>(null);
  const clipboards = useAppStore((state) => state.clipboards);
  const setClipboards = useAppStore((state) => state.setClipboards);

  useEffect(() => {
    const switchClipboard = window.electron.on(
      'clipboardSwitch',
      (index: number) => window.electron.switchClipboard(clipboards[index - 1])
    );
    return () => {
      switchClipboard();
    };
  }, [clipboards]);

  const onScroll = async () => {
    const bottom =
      myRef.current &&
      myRef.current.scrollHeight - myRef.current.scrollTop ===
        myRef.current.clientHeight;

    if (bottom) {
      const cursor = clipboards[clipboards.length - 1].id;
      const newClipboards = await window.electron.getClipboards({
        cursor,
        star,
        search,
      });
      setClipboards([...clipboards, ...newClipboards]);
    }
  };

  const IconFunctions = ({ id, ...clipboard }: Clipboard) => (
    <>
      <FontAwesomeIcon
        onClick={async (e) => {
          e.stopPropagation();
          const starState = await window.electron.starClipboard(id);
          setClipboards(
            clipboards.map((o) => (o.id === id ? { ...o, star: starState } : o))
          );
        }}
        className={`${
          clipboard.star
            ? 'dark:text-yellow-300 text-yellow-400'
            : 'text-zinc-700 hidden'
        } z-10 dark:text-white dark:hover:text-yellow-300 hover:text-yellow-400 text-xs group-hover:block`}
        icon={['fas', 'star']}
      />
      <FontAwesomeIcon
        onClick={async (e) => {
          e.stopPropagation();
          if (await window.electron.deleteClipboard(id)) {
            setClipboards(clipboards.filter((o) => o.id !== id));
          }
        }}
        className="dark:text-white text-zinc-700 dark:hover:text-red-600 hover:text-red-600 text-xs hidden group-hover:block"
        icon={['fas', 'trash-alt']}
      />
    </>
  );

  return (
    <div ref={myRef} onScroll={onScroll} className="overflow-auto h-full pb-5">
      {clipboards?.map((clipboard) => {
        const { content, type, id, createdDate, blob, width, height, size } =
          clipboard;
        return (
          <button
            key={id}
            type="button"
            className="px-3 group hover:bg-neutral-700 cursor-pointer w-full"
            onClick={(e) => {
              e.stopPropagation();
              window.electron.switchClipboard(clipboard);
            }}
          >
            <div className="flex py-3 justify-between" key={id}>
              <div className="flex min-w-0">
                <div className="flex items-center">
                  <FontAwesomeIcon
                    className="dark:text-white text-zinc-700 text-2xl"
                    icon={['fas', type as IconName]}
                  />
                </div>
                <div className="px-5 truncate">
                  {blob && width && height && size ? (
                    <img
                      src={URL.createObjectURL(
                        new Blob([new Uint8Array(blob)], { type: 'image/png' })
                      )}
                      style={{ height: '200px' }}
                      alt={`${width}x${height} ${size}`}
                      title={`${width}x${height} ${size}`}
                    />
                  ) : (
                    <div className="flex" title={content ?? ''}>
                      {type === 'palette' && (
                        <div
                          className="w-5 h-5 border border-solid border-black mr-1"
                          style={{ backgroundColor: `#${content}` }}
                        />
                      )}
                      <p className="text-sm">{content}</p>
                    </div>
                  )}
                  <div className="text-zinc-400 text-xs text-left">
                    {dayjs(createdDate).toNow(true)}
                  </div>
                </div>
              </div>
              <div className="pl-1 flex flex-col items-center justify-between">
                {IconFunctions(clipboard)}
              </div>
            </div>
            <hr className="text-zinc-600" />
          </button>
        );
      })}
    </div>
  );
}

Clipboards.defaultProps = defaultProps;

export default Clipboards;
