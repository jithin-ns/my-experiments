/**
 * seatmap-response.ts
 * -----------------------------------------------------------------------------
 * Reference response contract for rendering an airline seat map.
 * Designed for frontend consumption.
 */

export enum CabinType {
  FIRST = "FIRST",
  BUSINESS = "BUSINESS",
  PREMIUM_ECONOMY = "PREMIUM_ECONOMY",
  ECONOMY = "ECONOMY"
}

export enum DeckType {
  MAIN = "MAIN",
  UPPER = "UPPER"
}

export enum ElementType {
  SEAT = "SEAT",
  AISLE = "AISLE",
  GALLEY = "GALLEY",
  LAVATORY = "LAVATORY",
  EXIT = "EXIT",
  STAIRS = "STAIRS",
  DOOR = "DOOR",
  BULKHEAD = "BULKHEAD",
  EMPTY = "EMPTY"
}

export enum SeatStatus {
  AVAILABLE = "AVAILABLE",
  SELECTED = "SELECTED",
  OCCUPIED = "OCCUPIED",
  BLOCKED = "BLOCKED",
  UNAVAILABLE = "UNAVAILABLE",
  HELD = "HELD"
}

export enum SeatType {
  STANDARD = "STANDARD",
  PREFERRED = "PREFERRED",
  EXTRA_LEGROOM = "EXTRA_LEGROOM",
  EXIT_ROW = "EXIT_ROW",
  BASSINET = "BASSINET",
  BULKHEAD = "BULKHEAD",
  UNKNOWN = "UNKNOWN"
}

export interface SeatElement {
  /** Render type. Never assume every position is a seat. */
  elementType: ElementType;

  /** Present only when elementType === SEAT */
  seat?: {
    seatNumber: string;
    seatType: SeatType;
    status: SeatStatus;
    isSelectable: boolean;

    /** Null when free */
    price?: {
      amount: number;
      currency: string;
      label: string;
    };

    /** Independent characteristics */
    characteristics: string[];

    /** Optional icon override */
    icon?: string;

    /** Tooltip text */
    tooltip?: string;

    /** Passenger currently assigned */
    passengerId?: string;
  };

  /** Optional seat column (A,B,C...) */
  column?: string;

  /** Facility label if not a seat */
  label?: string;
}

export interface SeatRow {
  rowNumber: number;

  /** Row level facilities */
  facilities?: string[];

  /** Ordered rendering elements */
  elements: SeatElement[];
}

export interface Cabin {
  id: CabinType;
  displayName: string;
  startRow: number;
  endRow: number;

  /** Column labels shown above cabin */
  seatLetters: string[];

  rows: SeatRow[];
}

export interface Deck {
  id: DeckType;
  displayName: string;
  order: number;
  cabins: Cabin[];
}

export interface SeatMapResponse {
  aircraft: {
    aircraftType: string;
    registration?: string;
    layoutVersion: string;
  };

  configuration: {
    showEntireAircraft: boolean;
    defaultDeck: DeckType;

    /**
     * Fallback to use when backend introduces a new seat type
     * unknown to the UI.
     */
    unknownSeatFallback: {
      seatType: SeatType;
      icon: string;
      selectable: boolean;
      label: string;
    };
  };

  legend: Array<{
    id: string;
    label: string;
    icon: string;
  }>;

  seatTypes: Array<{
    id: SeatType;
    displayName: string;
    icon: string;
    color: string;
    priority: number;
  }>;

  messages: Array<{
    severity: "INFO" | "WARNING" | "ERROR";
    text: string;
  }>;

  decks: Deck[];
}

/* -------------------------------------------------------------------------- */
/* Example Response                                                            */
/* -------------------------------------------------------------------------- */

export const seatMapResponse: SeatMapResponse = {
  aircraft: {
    aircraftType: "Airbus A380-800",
    registration: "G-XLEA",
    layoutVersion: "1.0"
  },

  configuration: {
    showEntireAircraft: true,
    defaultDeck: DeckType.MAIN,
    unknownSeatFallback: {
      seatType: SeatType.STANDARD,
      icon: "seat-standard",
      selectable: true,
      label: "Standard Seat"
    }
  },

  legend: [
    { id: "AVAILABLE", label: "Available", icon: "seat-blue" },
    { id: "OCCUPIED", label: "Occupied", icon: "seat-grey" },
    { id: "BLOCKED", label: "Blocked", icon: "seat-blocked" },
    { id: "EXIT_ROW", label: "Exit Row", icon: "exit-seat" },
    { id: "EXTRA_LEGROOM", label: "Extra Legroom", icon: "legroom-seat" }
  ],

  seatTypes: [
    {
      id: SeatType.STANDARD,
      displayName: "Standard",
      icon: "seat-standard",
      color: "#1E5AA8",
      priority: 1
    },
    {
      id: SeatType.EXTRA_LEGROOM,
      displayName: "Extra Legroom",
      icon: "seat-legroom",
      color: "#0B7A75",
      priority: 2
    },
    {
      id: SeatType.EXIT_ROW,
      displayName: "Exit Row",
      icon: "seat-exit",
      color: "#C57D00",
      priority: 3
    }
  ],

  messages: [
    {
      severity: "WARNING",
      text: "Passengers occupying exit row seats must satisfy eligibility requirements."
    }
  ],

  decks: [
    {
      id: DeckType.UPPER,
      displayName: "Upper Deck",
      order: 1,
      cabins: [
        {
          id: CabinType.BUSINESS,
          displayName: "Business",
          startRow: 1,
          endRow: 5,
          seatLetters: ["A","C","D","F","H","K"],
          rows: [
            {
              rowNumber: 1,
              facilities:["DOOR"],
              elements:[
                {elementType:ElementType.SEAT,column:"A",seat:{seatNumber:"1A",seatType:SeatType.BULKHEAD,status:SeatStatus.AVAILABLE,isSelectable:true,characteristics:["WINDOW","BULKHEAD"],price:{amount:120,currency:"GBP",label:"£120"}}},
                {elementType:ElementType.AISLE},
                {elementType:ElementType.SEAT,column:"C",seat:{seatNumber:"1C",seatType:SeatType.STANDARD,status:SeatStatus.OCCUPIED,isSelectable:false,characteristics:["AISLE"]}},
                {elementType:ElementType.SEAT,column:"D",seat:{seatNumber:"1D",seatType:SeatType.STANDARD,status:SeatStatus.AVAILABLE,isSelectable:true,characteristics:["AISLE"]}},
                {elementType:ElementType.AISLE},
                {elementType:ElementType.SEAT,column:"F",seat:{seatNumber:"1F",seatType:SeatType.STANDARD,status:SeatStatus.AVAILABLE,isSelectable:true,characteristics:["AISLE"]}},
                {elementType:ElementType.SEAT,column:"H",seat:{seatNumber:"1H",seatType:SeatType.STANDARD,status:SeatStatus.BLOCKED,isSelectable:false,characteristics:["AISLE"]}},
                {elementType:ElementType.AISLE},
                {elementType:ElementType.SEAT,column:"K",seat:{seatNumber:"1K",seatType:SeatType.STANDARD,status:SeatStatus.SELECTED,isSelectable:true,characteristics:["WINDOW"],passengerId:"P1"}}
              ]
            }
          ]
        }
      ]
    },
    {
      id: DeckType.MAIN,
      displayName: "Main Deck",
      order: 2,
      cabins:[
        {
          id:CabinType.ECONOMY,
          displayName:"Economy",
          startRow:30,
          endRow:60,
          seatLetters:["A","B","C","D","E","F","G","H","J","K"],
          rows:[
            {
              rowNumber:30,
              facilities:["EXIT"],
              elements:[
                {elementType:ElementType.SEAT,column:"A",seat:{seatNumber:"30A",seatType:SeatType.EXIT_ROW,status:SeatStatus.AVAILABLE,isSelectable:true,price:{amount:95,currency:"GBP",label:"£95"},characteristics:["WINDOW","EXIT_ROW","EXTRA_LEGROOM"]}},
                {elementType:ElementType.SEAT,column:"B",seat:{seatNumber:"30B",seatType:SeatType.EXIT_ROW,status:SeatStatus.OCCUPIED,isSelectable:false,characteristics:["MIDDLE","EXIT_ROW"]}},
                {elementType:ElementType.SEAT,column:"C",seat:{seatNumber:"30C",seatType:SeatType.EXIT_ROW,status:SeatStatus.AVAILABLE,isSelectable:true,characteristics:["AISLE","EXIT_ROW"]}},
                {elementType:ElementType.AISLE},
                {elementType:ElementType.SEAT,column:"D",seat:{seatNumber:"30D",seatType:SeatType.EXTRA_LEGROOM,status:SeatStatus.AVAILABLE,isSelectable:true,price:{amount:70,currency:"GBP",label:"£70"},characteristics:["MIDDLE","EXTRA_LEGROOM"]}},
                {elementType:ElementType.SEAT,column:"E",seat:{seatNumber:"30E",seatType:SeatType.UNKNOWN,status:SeatStatus.AVAILABLE,isSelectable:true,characteristics:["MIDDLE"],tooltip:"Unknown type demo"}},
                {elementType:ElementType.SEAT,column:"F",seat:{seatNumber:"30F",seatType:SeatType.STANDARD,status:SeatStatus.HELD,isSelectable:false,characteristics:["MIDDLE"]}},
                {elementType:ElementType.SEAT,column:"G",seat:{seatNumber:"30G",seatType:SeatType.STANDARD,status:SeatStatus.AVAILABLE,isSelectable:true,characteristics:["AISLE"]}},
                {elementType:ElementType.AISLE},
                {elementType:ElementType.SEAT,column:"H",seat:{seatNumber:"30H",seatType:SeatType.STANDARD,status:SeatStatus.UNAVAILABLE,isSelectable:false,characteristics:["AISLE"]}},
                {elementType:ElementType.SEAT,column:"J",seat:{seatNumber:"30J",seatType:SeatType.STANDARD,status:SeatStatus.AVAILABLE,isSelectable:true,characteristics:["MIDDLE"]}},
                {elementType:ElementType.SEAT,column:"K",seat:{seatNumber:"30K",seatType:SeatType.STANDARD,status:SeatStatus.AVAILABLE,isSelectable:true,characteristics:["WINDOW"]}}
              ]
            },
            {
              rowNumber:31,
              elements:[
                {elementType:ElementType.GALLEY,label:"Galley"},
                {elementType:ElementType.AISLE},
                {elementType:ElementType.LAVATORY,label:"Lavatory"},
                {elementType:ElementType.AISLE},
                {elementType:ElementType.STAIRS,label:"Upper Deck Access"}
              ]
            }
          ]
        }
      ]
    }
  ]
};

/**
 * Rendering recommendations:
 * 1. Render elements strictly in the order received.
 * 2. Never infer aisle positions.
 * 3. Never hardcode cabin layouts (3-4-3, 2-4-2 etc.).
 * 4. Use seatTypes for icon/color mapping.
 * 5. Use unknownSeatFallback for unrecognized seat types.
 * 6. Ignore unknown fields for forward compatibility.
 */
