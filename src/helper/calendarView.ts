export function getCalendarHeight() {
    let height = window.innerHeight
    switch (true) {
      case ( height > 1200):
            return 900;
      case (1080 < height && height <= 1200):
            return 889;

      case (1050 < height && height <= 1080):
            return 762;

      case (900 < height && height <= 1050):
            return 675;

      case (768 <= height && height <= 900):
            return 542;
      default:
            return 490;
  }
}

export function getChildNum() {
    let height = window.innerHeight
    switch (true) {
      case ( height > 1200):
            return 87;
      case (1080 < height && height <= 1200):
            return 84;

      case (1050 < height && height <= 1080):
            return 82;

      case (900 < height && height <= 1050):
            return 80;

      case (768 <= height && height <= 900):
            return 77;
      default:
            return 76;
  }
}
