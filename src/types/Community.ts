
export type Channel = {
  id: string;
  name: string;
  type: "text" | "voice";
};

export type Community = {
  id: string;
  name: string;
  icon: string;
  channels: Channel[];
};
