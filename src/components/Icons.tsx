import React from "react";

interface IconProps {
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}

export const HomeIcon: React.FC<IconProps> = ({
  size = 24,
  className = "",
  style,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    style={style}
  >
    <path d="M12.5 3.247a1 1 0 00-1 0L4 7.577V20h4.5v-6a1 1 0 011-1h5a1 1 0 011 1v6H20V7.577l-7.5-4.33z" />
  </svg>
);

export const SearchIcon: React.FC<IconProps> = ({
  size = 24,
  className = "",
  style,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    style={style}
  >
    <path d="M10.533 1.279c-5.18 0-9.407 4.14-9.407 9.279s4.226 9.279 9.407 9.279c2.234 0 4.29-.77 5.907-2.058l4.353 4.353a1 1 0 101.414-1.414l-4.344-4.344a9.157 9.157 0 002.077-5.816c0-5.14-4.226-9.28-9.407-9.28zm-7.407 9.279c0-4.006 3.302-7.28 7.407-7.28s7.407 3.274 7.407 7.28-3.302 7.279-7.407 7.279-7.407-3.273-7.407-7.28z" />
  </svg>
);

export const PlayIcon: React.FC<IconProps> = ({
  size = 24,
  className = "",
  style,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    style={style}
  >
    <path d="M7.05 3.606l13.49 7.788a.7.7 0 010 1.212L7.05 20.394A.7.7 0 016 19.788V4.212a.7.7 0 011.05-.606z" />
  </svg>
);

export const PauseIcon: React.FC<IconProps> = ({
  size = 24,
  className = "",
  style,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    style={style}
  >
    <path d="M5.7 3a.7.7 0 00-.7.7v16.6a.7.7 0 00.7.7h2.6a.7.7 0 00.7-.7V3.7a.7.7 0 00-.7-.7H5.7zm10 0a.7.7 0 00-.7.7v16.6a.7.7 0 00.7.7h2.6a.7.7 0 00.7-.7V3.7a.7.7 0 00-.7-.7h-2.6z" />
  </svg>
);

export const SkipBackIcon: React.FC<IconProps> = ({
  size = 24,
  className = "",
  style,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    style={style}
  >
    <path d="M4.54 5.62a.75.75 0 00-1.04 1.16L5.89 9H2.75a.75.75 0 000 1.5h4.61a.75.75 0 00.53-1.28L4.54 5.62zM15 19.25a1.25 1.25 0 11-2.5 0V4.75a1.25 1.25 0 012.5 0v14.5zm6 0a1.25 1.25 0 11-2.5 0V4.75a1.25 1.25 0 012.5 0v14.5z" />
  </svg>
);

export const SkipForwardIcon: React.FC<IconProps> = ({
  size = 24,
  className = "",
  style,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    style={style}
  >
    <path d="M19.46 5.62a.75.75 0 011.04 1.16L18.11 9h3.14a.75.75 0 010 1.5h-4.61a.75.75 0 01-.53-1.28l3.35-3.6zM9 19.25a1.25 1.25 0 102.5 0V4.75a1.25 1.25 0 00-2.5 0v14.5zm-6 0A1.25 1.25 0 004.25 18V4.75a1.25 1.25 0 00-2.5 0V18A1.25 1.25 0 003 19.25z" />
  </svg>
);

export const VolumeIcon: React.FC<IconProps> = ({
  size = 24,
  className = "",
  style,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    style={style}
  >
    <path d="M13.5 1.75a.75.75 0 00-1.264-.546L6.925 6H2.75A1.75 1.75 0 001 7.75v8.5C1 17.216 1.784 18 2.75 18h4.175l5.311 4.796A.75.75 0 0013.5 22V1.75z" />
  </svg>
);

export const VolumeMuteIcon: React.FC<IconProps> = ({
  size = 24,
  className = "",
  style,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    style={style}
  >
    <path d="M13.53 1.59a.75.75 0 01.47 1.34L12.41 4.5l1.59 1.57a.75.75 0 01-1.06 1.06l-1.59-1.57-1.59 1.57a.75.75 0 11-1.06-1.06l1.59-1.57-1.59-1.57a.75.75 0 011.06-1.06l1.59 1.57 1.59-1.57a.75.75 0 01.59-.25zM3 6.25C3 5.56 3.56 5 4.25 5h2.268l2.165-1.955A2.25 2.25 0 0112 4.691v2.268L9.06 9.5H4.25A1.25 1.25 0 013 8.25v-2zm0 7.5c0-.69.56-1.25 1.25-1.25h4.81l3 3H4.25A1.25 1.25 0 013 15.25v-1.5zm7.5 4.559l-2.165-1.955H9.19l4.56 4.115a2.25 2.25 0 003.75-1.694v-2.268l1.94 1.746a.75.75 0 101.06-1.06l-1.94-1.746 1.94-1.746a.75.75 0 10-1.06-1.06l-1.94 1.746v-2.268a2.25 2.25 0 00-3.75-1.694L9.19 14.5h.81l2.165-1.955 3.34 3v1.91l-3.34 3-.66.604z" />
  </svg>
);

export const RepeatIcon: React.FC<IconProps> = ({
  size = 24,
  className = "",
  style,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    style={style}
  >
    <path d="M5.47 2.47a.75.75 0 011.06 1.06L4.56 5.5H15a5.5 5.5 0 015.368 6.845.75.75 0 01-1.45-.387A4 4 0 0015 7H4.56l1.97 1.97a.75.75 0 01-1.06 1.06l-3.25-3.25a.75.75 0 010-1.06l3.25-3.25zM18.53 21.53a.75.75 0 01-1.06-1.06l1.97-1.97H9a5.5 5.5 0 01-5.368-6.845.75.75 0 111.45.387A4 4 0 009 17h10.44l-1.97-1.97a.75.75 0 111.06-1.06l3.25 3.25a.75.75 0 010 1.06l-3.25 3.25z" />
  </svg>
);

export const RepeatOneIcon: React.FC<IconProps> = ({
  size = 24,
  className = "",
  style,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    style={style}
  >
    <path d="M10.5 1.75a.75.75 0 00-1.5 0v4.5l-.22-.22a.75.75 0 00-1.06 1.06l1.5 1.5a.749.749 0 00.286.162.75.75 0 00.787-.162l1.5-1.5a.75.75 0 10-1.06-1.06l-.22.22V1.75z" />
    <path d="M5.47 2.47a.75.75 0 011.06 1.06L4.56 5.5H15a5.5 5.5 0 015.368 6.845.75.75 0 01-1.45-.387A4 4 0 0015 7H4.56l1.97 1.97a.75.75 0 01-1.06 1.06l-3.25-3.25a.75.75 0 010-1.06l3.25-3.25zM18.53 21.53a.75.75 0 01-1.06-1.06l1.97-1.97H9a5.5 5.5 0 01-5.368-6.845.75.75 0 111.45.387A4 4 0 009 17h10.44l-1.97-1.97a.75.75 0 111.06-1.06l3.25 3.25a.75.75 0 010 1.06l-3.25 3.25z" />
  </svg>
);

export const ShuffleIcon: React.FC<IconProps> = ({
  size = 24,
  className = "",
  style,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    style={style}
  >
    <path d="M18.085 15.414a.75.75 0 011.06 1.06l-2.12 2.121a.75.75 0 01-1.061 0l-2.121-2.121a.75.75 0 111.06-1.06l1.59 1.59 1.592-1.59z" />
    <path d="M14.875 4.094l2.121 2.121-2.121 2.121a.75.75 0 01-1.06-1.06l1.59-1.591-1.59-1.59a.75.75 0 011.06-1.061z" />
    <path d="M17.5 2.5a.75.75 0 01.53.22l3.5 3.5a.75.75 0 010 1.06l-3.5 3.5a.75.75 0 11-1.06-1.06l2.22-2.22H17.5c-.619 0-1.161.542-1.161 1.161 0 2.384 1.908 4.77 5.294 5.63a.75.75 0 01-.266 1.477c-4.207-1.086-7.278-4.438-7.278-7.107A2.664 2.664 0 0117.5 4h1.69l-2.22-2.22A.75.75 0 0117.5 2.5zM6.5 21.5a.75.75 0 01-.53-1.28l2.22-2.22H6.5a2.664 2.664 0 01-2.661-2.661c0-2.669 3.071-6.021 7.278-7.107a.75.75 0 01.266 1.477c-3.386.86-5.294 3.246-5.294 5.63 0 .619.542 1.161 1.161 1.161h1.69l-2.22-2.22A.75.75 0 016.5 21.5z" />
  </svg>
);

export const ListIcon: React.FC<IconProps> = ({
  size = 24,
  className = "",
  style,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    style={style}
  >
    <path d="M3 4.5A1.5 1.5 0 014.5 3h15A1.5 1.5 0 0121 4.5v15a1.5 1.5 0 01-1.5 1.5h-15A1.5 1.5 0 013 19.5v-15zM4.5 4a.5.5 0 00-.5.5v15a.5.5 0 00.5.5h15a.5.5 0 00.5-.5v-15a.5.5 0 00-.5-.5h-15z" />
    <path d="M8 7a.75.75 0 01.75-.75h8.5a.75.75 0 010 1.5h-8.5A.75.75 0 018 7zM8 12a.75.75 0 01.75-.75h8.5a.75.75 0 010 1.5h-8.5A.75.75 0 018 12zM8 17a.75.75 0 01.75-.75h8.5a.75.75 0 010 1.5h-8.5A.75.75 0 018 17z" />
  </svg>
);

export const GridIcon: React.FC<IconProps> = ({
  size = 24,
  className = "",
  style,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    style={style}
  >
    <path d="M3 4.5A1.5 1.5 0 014.5 3h3A1.5 1.5 0 019 4.5v3A1.5 1.5 0 017.5 9h-3A1.5 1.5 0 013 7.5v-3zM4.5 4a.5.5 0 00-.5.5v3a.5.5 0 00.5.5h3a.5.5 0 00.5-.5v-3a.5.5 0 00-.5-.5h-3z" />
    <path d="M12 4.5A1.5 1.5 0 0113.5 3h3A1.5 1.5 0 0118 4.5v3A1.5 1.5 0 0116.5 9h-3A1.5 1.5 0 0112 7.5v-3zM13.5 4a.5.5 0 00-.5.5v3a.5.5 0 00.5.5h3a.5.5 0 00.5-.5v-3a.5.5 0 00-.5-.5h-3z" />
    <path d="M3 16.5A1.5 1.5 0 014.5 15h3A1.5 1.5 0 019 16.5v3A1.5 1.5 0 017.5 21h-3A1.5 1.5 0 013 19.5v-3zM4.5 16a.5.5 0 00-.5.5v3a.5.5 0 00.5.5h3a.5.5 0 00.5-.5v-3a.5.5 0 00-.5-.5h-3z" />
    <path d="M12 16.5A1.5 1.5 0 0113.5 15h3A1.5 1.5 0 0118 16.5v3A1.5 1.5 0 0116.5 21h-3A1.5 1.5 0 0112 19.5v-3zM13.5 16a.5.5 0 00-.5.5v3a.5.5 0 00.5.5h3a.5.5 0 00.5-.5v-3a.5.5 0 00-.5-.5h-3z" />
  </svg>
);

export const UsersIcon: React.FC<IconProps> = ({
  size = 24,
  className = "",
  style,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    style={style}
  >
    <path d="M4.5 4.5a3 3 0 013-3h9a3 3 0 013 3v9a3 3 0 01-3 3h-3.823l-2.972 2.972A1 1 0 019 19.177V16.5H7.5a3 3 0 01-3-3v-9z" />
  </svg>
);

export const PlusIcon: React.FC<IconProps> = ({
  size = 24,
  className = "",
  style,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    style={style}
  >
    <path d="M10.5 3.75a.75.75 0 01.75.75v5.25h5.25a.75.75 0 010 1.5H11.25v5.25a.75.75 0 01-1.5 0v-5.25H4.5a.75.75 0 010-1.5h5.25V4.5a.75.75 0 01.75-.75z" />
  </svg>
);

export const XIcon: React.FC<IconProps> = ({
  size = 24,
  className = "",
  style,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    style={style}
  >
    <path d="M5.47 5.47a.75.75 0 011.06 0l5.47 5.47 5.47-5.47a.75.75 0 111.06 1.06l-5.47 5.47 5.47 5.47a.75.75 0 11-1.06 1.06l-5.47-5.47-5.47 5.47a.75.75 0 01-1.06-1.06l5.47-5.47-5.47-5.47a.75.75 0 010-1.06z" />
  </svg>
);

export const MusicIcon: React.FC<IconProps> = ({
  size = 24,
  className = "",
  style,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    style={style}
  >
    <path d="M19.952 1.651a.75.75 0 01.298.599V16.303a3 3 0 11-1.5-2.598v-5.425L9.702 11.14a.75.75 0 01-.955-.703v-5.49a3 3 0 111.5 2.598v3.353l9.407-2.293a.75.75 0 01.298-.054z" />
  </svg>
);

export const QueueIcon: React.FC<IconProps> = ({
  size = 24,
  className = "",
  style,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    style={style}
  >
    <path d="M3 4.5A1.5 1.5 0 014.5 3h15A1.5 1.5 0 0121 4.5v15a1.5 1.5 0 01-1.5 1.5h-15A1.5 1.5 0 013 19.5v-15zM4.5 4a.5.5 0 00-.5.5v15a.5.5 0 00.5.5h15a.5.5 0 00.5-.5v-15a.5.5 0 00-.5-.5h-15z" />
    <path d="M8 7.75A.75.75 0 018.75 7h6.5a.75.75 0 010 1.5h-6.5a.75.75 0 01-.75-.75zM8 12a.75.75 0 01.75-.75h4.5a.75.75 0 010 1.5h-4.5A.75.75 0 018 12zM8 16.25a.75.75 0 01.75-.75h6.5a.75.75 0 010 1.5h-6.5a.75.75 0 01-.75-.75z" />
  </svg>
);

export const LyricsIcon: React.FC<IconProps> = ({
  size = 24,
  className = "",
  style,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    style={style}
  >
    <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zM8 8a1 1 0 011-1h6a1 1 0 110 2H9a1 1 0 01-1-1zm0 4a1 1 0 011-1h6a1 1 0 110 2H9a1 1 0 01-1-1zm0 4a1 1 0 011-1h6a1 1 0 110 2H9a1 1 0 01-1-1z" />
  </svg>
);

export const EqualizerIcon: React.FC<IconProps> = ({
  size = 24,
  className = "",
  style,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    style={style}
  >
    <path d="M6 18a2 2 0 100-4 2 2 0 000 4zm0 2a4 4 0 100-8 4 4 0 000 8z" />
    <path d="M12 18a2 2 0 100-4 2 2 0 000 4zm0 2a4 4 0 100-8 4 4 0 000 8z" />
    <path d="M18 18a2 2 0 100-4 2 2 0 000 4zm0 2a4 4 0 100-8 4 4 0 000 8z" />
    <path d="M5 3a1 1 0 011 1v12a1 1 0 11-2 0V4a1 1 0 011-1zM11 3a1 1 0 011 1v12a1 1 0 11-2 0V4a1 1 0 011-1zM17 3a1 1 0 011 1v12a1 1 0 11-2 0V4a1 1 0 011-1z" />
  </svg>
);

export const StatsIcon: React.FC<IconProps> = ({
  size = 24,
  className = "",
  style,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    style={style}
  >
    <path d="M3 3.75A.75.75 0 013.75 3h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 3.75z" />
    <path d="M3 7.5a.75.75 0 01.75-.75h4.5a.75.75 0 01.75.75v12.75a.75.75 0 01-1.5 0V8.25H3.75A.75.75 0 013 7.5z" />
    <path d="M8.25 7.5a.75.75 0 01.75.75v6.75a.75.75 0 01-1.5 0V8.25a.75.75 0 01.75-.75z" />
    <path d="M12 7.5a.75.75 0 01.75.75v8.25a.75.75 0 01-1.5 0V8.25A.75.75 0 0112 7.5z" />
    <path d="M15.75 7.5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5a.75.75 0 01.75-.75z" />
    <path d="M19.5 7.5a.75.75 0 01.75.75v10.5a.75.75 0 01-1.5 0V8.25a.75.75 0 01.75-.75z" />
  </svg>
);

export const TrashIcon: React.FC<IconProps> = ({
  size = 24,
  className = "",
  style,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    style={style}
  >
    <path d="M16 1.75V3h5.25a.75.75 0 010 1.5H2.75a.75.75 0 010-1.5H8V1.75C8 .784 8.784 0 9.75 0h4.5C15.216 0 16 .784 16 1.75zm-6.5 0a.25.25 0 01.25-.25h4.5a.25.25 0 01.25.25V3h-5V1.75z" />
    <path d="M4.496 6.875a.606.606 0 01-.497-.617l.602-10.5a.607.607 0 011.097-.38l9.597 9.597a.607.607 0 01-.38 1.097l-10.5.602a.605.605 0 01-.609-.499z" />
  </svg>
);

export const UploadIcon: React.FC<IconProps> = ({
  size = 24,
  className = "",
  style,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    style={style}
  >
    <path d="M11.47 1.72a.75.75 0 011.06 0l4.5 4.5a.75.75 0 01-1.06 1.06L12.75 4.56V18.25a.75.75 0 01-1.5 0V4.56L8.03 7.28a.75.75 0 01-1.06-1.06l4.5-4.5z" />
    <path d="M3.75 12a.75.75 0 01.75.75v6.5a.75.75 0 00.75.75h13.5a.75.75 0 00.75-.75v-6.5a.75.75 0 011.5 0v6.5A2.25 2.25 0 0118.75 21H5.25A2.25 2.25 0 013 19.25v-6.5a.75.75 0 01.75-.75z" />
  </svg>
);

export const MenuIcon: React.FC<IconProps> = ({
  size = 24,
  className = "",
  style,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    style={style}
  >
    <path d="M4.5 5.75a.75.75 0 01.75-.75h13.5a.75.75 0 010 1.5H5.25a.75.75 0 01-.75-.75zM4.5 11.25a.75.75 0 01.75-.75h13.5a.75.75 0 010 1.5H5.25a.75.75 0 01-.75-.75zM4.5 16.75a.75.75 0 01.75-.75h13.5a.75.75 0 010 1.5H5.25a.75.75 0 01-.75-.75z" />
  </svg>
);

export const MoreIcon: React.FC<IconProps> = ({
  size = 24,
  className = "",
  style,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    style={style}
  >
    <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
  </svg>
);

export const EditIcon: React.FC<IconProps> = ({
  size = 24,
  className = "",
  style,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    style={style}
  >
    <path d="M16.293 2.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-9 9a1 1 0 01-.39.242l-5 1.5a1 1 0 01-1.21-1.211l1.5-5a1 1 0 01.242-.39l9-9zM15.586 4L4 15.586V19h3.414L19 7.414 15.586 4z" />
  </svg>
);

export const SmartPlaylistIcon: React.FC<IconProps> = ({
  size = 24,
  className = "",
  style,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    style={style}
  >
    <path d="M13 3l3.293 3.293-7 7L12 21l-3.293-3.293 7-7L11 3h2z" />
  </svg>
);

export const Volume1Icon: React.FC<IconProps> = ({
  size = 24,
  className = "",
  style,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    style={style}
  >
    <path d="M13.5 1.75a.75.75 0 00-1.264-.546L6.925 6H2.75A1.75 1.75 0 001 7.75v8.5C1 17.216 1.784 18 2.75 18h4.175l5.311 4.796A.75.75 0 0013.5 22V1.75z" />
    <path d="M17.5 9.8a.75.75 0 00-1.06 1.06 2.5 2.5 0 010 2.263.75.75 0 101.273.799 4 4 0 000-4.925z" />
  </svg>
);

export const Volume2Icon: React.FC<IconProps> = ({
  size = 24,
  className = "",
  style,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    style={style}
  >
    <path d="M13.5 1.75a.75.75 0 00-1.264-.546L6.925 6H2.75A1.75 1.75 0 001 7.75v8.5C1 17.216 1.784 18 2.75 18h4.175l5.311 4.796A.75.75 0 0013.5 22V1.75z" />
    <path d="M18.719 3.781a.75.75 0 00-1.06 1.06 7.976 7.976 0 010 10.338.75.75 0 001.06 1.06 9.476 9.476 0 000-12.458z" />
    <path d="M15.53 6.97a.75.75 0 10-1.06 1.06 3.5 3.5 0 010 4.156.75.75 0 101.06 1.06 5 5 0 000-6.276z" />
  </svg>
);

export const ChartIcon: React.FC<IconProps> = ({
  size = 24,
  className = "",
  style,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    style={style}
  >
    <path d="M3 3.75A.75.75 0 013.75 3h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 3.75z" />
    <path d="M3 7.5a.75.75 0 01.75-.75h4.5a.75.75 0 01.75.75v12.75a.75.75 0 01-1.5 0V8.25H3.75A.75.75 0 013 7.5z" />
    <path d="M8.25 7.5a.75.75 0 01.75.75v6.75a.75.75 0 01-1.5 0V8.25a.75.75 0 01.75-.75z" />
    <path d="M12 7.5a.75.75 0 01.75.75v8.25a.75.75 0 01-1.5 0V8.25A.75.75 0 0112 7.5z" />
    <path d="M15.75 7.5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5a.75.75 0 01.75-.75z" />
    <path d="M19.5 7.5a.75.75 0 01.75.75v10.5a.75.75 0 01-1.5 0V8.25a.75.75 0 01.75-.75z" />
  </svg>
);

export const BarIcon: React.FC<IconProps> = ({
  size = 24,
  className = "",
  style,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    style={style}
  >
    <path d="M3 18a1 1 0 011-1h1a1 1 0 011 1v4a1 1 0 01-1 1H4a1 1 0 01-1-1v-4zM8 12a1 1 0 011-1h1a1 1 0 011 1v10a1 1 0 01-1 1H9a1 1 0 01-1-1V12zM13 15a1 1 0 011-1h1a1 1 0 011 1v7a1 1 0 01-1 1h-1a1 1 0 01-1-1v-7zM18 9a1 1 0 011-1h1a1 1 0 011 1v13a1 1 0 01-1 1h-1a1 1 0 01-1-1V9z" />
  </svg>
);

export const WaveIcon: React.FC<IconProps> = ({
  size = 24,
  className = "",
  style,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    style={style}
  >
    <path d="M4 11a1 1 0 011 1v4a1 1 0 11-2 0v-4a1 1 0 011-1zm3-3a1 1 0 011 1v10a1 1 0 11-2 0V9a1 1 0 011-1zm3 5a1 1 0 011 1v2a1 1 0 11-2 0v-2a1 1 0 011-1zm3-7a1 1 0 011 1v14a1 1 0 11-2 0V6a1 1 0 011-1zm3 3a1 1 0 011 1v8a1 1 0 11-2 0V9a1 1 0 011-1zm3-2a1 1 0 011 1v12a1 1 0 11-2 0V7a1 1 0 011-1z" />
  </svg>
);

export const CircleIcon: React.FC<IconProps> = ({
  size = 24,
  className = "",
  style,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    style={style}
  >
    <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 18a8 8 0 110-16 8 8 0 010 16z" />
    <path d="M12 5a7 7 0 017 7h2a9 9 0 00-9-9v2zm0 12a7 7 0 01-7-7H3a9 9 0 009 9v-2z" />
    <path d="M12 7a5 5 0 015 5h2a7 7 0 00-7-7v2zm0 8a5 5 0 01-5-5H5a7 7 0 007 7v-2z" />
  </svg>
);

export const TrendingUpIcon: React.FC<IconProps> = ({
  size = 24,
  className = "",
  style,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    style={style}
  >
    <path d="M15.59 9.17L12 12.76l-3.29-3.3-4.95 4.95-1.06-1.06 6.01-6.01 3.29 3.3 3.95-3.95L22 8.92l-1.06 1.06-5.35-0.81z" />
  </svg>
);

export const SaveIcon: React.FC<IconProps> = ({
  size = 24,
  className = "",
  style,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    style={style}
  >
    <path d="M17 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z" />
  </svg>
);

export const RefreshIcon: React.FC<IconProps> = ({
  size = 24,
  className = "",
  style,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    style={style}
  >
    <path d="M17.65 6.35A7.958 7.958 0 0012 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08A5.99 5.99 0 0112 18c-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z" />
  </svg>
);

export const ClockIcon: React.FC<IconProps> = ({
  size = 24,
  className = "",
  style,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    style={style}
  >
    <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
  </svg>
);

export const GripVerticalIcon: React.FC<IconProps> = ({
  size = 24,
  className = "",
  style,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    style={style}
  >
    <path d="M9 6a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm6 0a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM9 13.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm6 0a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM9 21a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm6 0a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
  </svg>
);

export const VisualizerIcon: React.FC<IconProps> = ({
  size = 24,
  className = "",
  style,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    style={style}
  >
    <path d="M3 8a1 1 0 011-1h1a1 1 0 011 1v8a1 1 0 01-1 1H4a1 1 0 01-1-1V8zM8 5a1 1 0 011-1h1a1 1 0 011 1v14a1 1 0 01-1 1H9a1 1 0 01-1-1V5zM13 10a1 1 0 011-1h1a1 1 0 011 1v4a1 1 0 01-1 1h-1a1 1 0 01-1-1v-4zM18 7a1 1 0 011-1h1a1 1 0 011 1v10a1 1 0 01-1 1h-1a1 1 0 01-1-1V7z" />
  </svg>
);

export const SettingsIcon: React.FC<IconProps> = ({
  size = 24,
  className = "",
  style,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    style={style}
  >
    <path d="M10.689 2.591a.75.75 0 00-1.378 0l-.868 1.84a.75.75 0 01-.434.435l-1.84.867a.75.75 0 000 1.378l1.84.868a.75.75 0 01.435.434l.867 1.84a.75.75 0 001.378 0l.868-1.84a.75.75 0 01.435-.434l1.84-.868a.75.75 0 000-1.378l-1.84-.867a.75.75 0 01-.434-.435l-.868-1.84z" />
    <path d="M12 8a4 4 0 100 8 4 4 0 000-8zM8 12a4 4 0 118 0 4 4 0 01-8 0z" />
    <path d="M19.689 11.591a.75.75 0 00-1.378 0l-.299.634a4.007 4.007 0 01-.773.773l-.634.299a.75.75 0 000 1.378l.634.299c.25.118.477.28.672.475.195.195.357.422.475.672l.299.634a.75.75 0 001.378 0l.299-.634a4.006 4.006 0 01.475-.672c.195-.195.422-.357.672-.475l.634-.299a.75.75 0 000-1.378l-.634-.299a4.007 4.007 0 01-.672-.475 4.006 4.006 0 01-.475-.672l-.299-.634z" />
  </svg>
);

export const Home = HomeIcon;
export const Search = SearchIcon;
export const Play = PlayIcon;
export const Pause = PauseIcon;
export const SkipBack = SkipBackIcon;
export const SkipForward = SkipForwardIcon;
export const VolumeX = VolumeMuteIcon;
export const Volume1 = Volume1Icon;
export const Volume2 = Volume2Icon;
export const Volume = VolumeIcon;
export const Repeat = RepeatIcon;
export const RepeatOne = RepeatOneIcon;
export const Shuffle = ShuffleIcon;
export const List = ListIcon;
export const Grid = GridIcon;
export const Users = UsersIcon;
export const Plus = PlusIcon;
export const Close = XIcon;
export const X = XIcon;
export const Music = MusicIcon;
export const Queue = QueueIcon;
export const Lyrics = LyricsIcon;
export const Equalizer = EqualizerIcon;
export const Stats = StatsIcon;
export const Chart = ChartIcon;
export const Trash = TrashIcon;
export const Upload = UploadIcon;
export const Menu = MenuIcon;
export const More = MoreIcon;
export const Visualizer = VisualizerIcon;
export const Settings = SettingsIcon;
export const Edit = EditIcon;
export const SmartPlaylist = SmartPlaylistIcon;
export const Playlist = ListIcon;
export const GripVertical = GripVerticalIcon;
export const Bar = BarIcon;
export const Wave = WaveIcon;
export const Circle = CircleIcon;
export const TrendingUp = TrendingUpIcon;
export const Save = SaveIcon;
export const Refresh = RefreshIcon;
export const Clock = ClockIcon;
