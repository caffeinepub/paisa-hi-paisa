import Int "mo:core/Int";
import Nat "mo:core/Nat";
import Array "mo:core/Array";
import Text "mo:core/Text";

// Shared date utilities
module {
  // Convert nanosecond timestamp (Int) to "YYYY-MM-DD" DateKey
  public func toDateKey(now : Int) : Text {
    let secondsTotal = Int.abs(now) / 1_000_000_000;
    let days = secondsTotal / 86400;
    var remaining = days;
    var year : Nat = 1970;
    // Find year
    var cont = true;
    while (cont) {
      let daysInYear : Nat = if ((year % 4 == 0 and year % 100 != 0) or year % 400 == 0) { 366 } else { 365 };
      if (remaining < daysInYear) {
        cont := false;
      } else {
        remaining -= daysInYear;
        year += 1;
      };
    };
    let isLeap = (year % 4 == 0 and year % 100 != 0) or year % 400 == 0;
    let monthDays : [Nat] = [31, if isLeap { 29 } else { 28 }, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    var month : Nat = 1;
    var contM = true;
    var idx = 0;
    while (contM and idx < monthDays.size()) {
      let md = monthDays[idx];
      if (remaining < md) {
        contM := false;
      } else {
        remaining -= md;
        month += 1;
        idx += 1;
      };
    };
    let day = remaining + 1;
    let ys = year.toText();
    let ms = if (month < 10) { "0" # month.toText() } else { month.toText() };
    let ds = if (day < 10) { "0" # day.toText() } else { day.toText() };
    ys # "-" # ms # "-" # ds;
  };

  // Compute the DateKey for one day before the given "YYYY-MM-DD"
  public func prevDay(today : Text) : Text {
    // Split "YYYY-MM-DD" on '-'
    var parts : [Text] = [];
    var current = "";
    for (c in today.toIter()) {
      if (c == '-') {
        parts := parts.concat([current]);
        current := "";
      } else {
        current := current # Text.fromChar(c);
      };
    };
    parts := parts.concat([current]);

    if (parts.size() != 3) { return "" };
    let yOpt = Nat.fromText(parts[0]);
    let mOpt = Nat.fromText(parts[1]);
    let dOpt = Nat.fromText(parts[2]);
    switch (yOpt, mOpt, dOpt) {
      case (?y, ?m, ?d) {
        if (d > 1) {
          let dd = Nat.sub(d, 1);
          let ds = if (dd < 10) { "0" # dd.toText() } else { dd.toText() };
          let ms2 = if (m < 10) { "0" # m.toText() } else { m.toText() };
          y.toText() # "-" # ms2 # "-" # ds;
        } else if (m > 1) {
          let pm = Nat.sub(m, 1);
          let isLeap = (y % 4 == 0 and y % 100 != 0) or y % 400 == 0;
          let lastDay : Nat = switch (pm) {
            case 1  { 31 };
            case 2  { if isLeap { 29 } else { 28 } };
            case 3  { 31 };
            case 4  { 30 };
            case 5  { 31 };
            case 6  { 30 };
            case 7  { 31 };
            case 8  { 31 };
            case 9  { 30 };
            case 10 { 31 };
            case 11 { 30 };
            case _  { 31 };
          };
          let ms2 = if (pm < 10) { "0" # pm.toText() } else { pm.toText() };
          let ds = if (lastDay < 10) { "0" # lastDay.toText() } else { lastDay.toText() };
          y.toText() # "-" # ms2 # "-" # ds;
        } else {
          (Nat.sub(y, 1)).toText() # "-12-31";
        };
      };
      case _ { "" };
    };
  };
};
