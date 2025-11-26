export interface RootObject {
  data: Datum[];
  meta: Meta;
}

export interface Datum {
  id: string;
  title: string;
  tags: string[];
  description: null | string;
  media: Media[];
  created: Date;
  updated: Date;
  endsAt: Date;
  _count: Count;
}

export interface Count {
  bids: number;
}

export interface Media {
  alt: string;
  url: string;
}

export interface Meta {
  currentPage: number;
  isFirstPage: boolean;
  isLastPage: boolean;
  nextPage: number;
  pageCount: number;
  previousPage: null;
  totalCount: number;
}
