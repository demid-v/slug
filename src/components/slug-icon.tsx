export const SlugIcon = ({
  width,
  height,
  className,
}: {
  width: number | string;
  height: number | string;
  className?: string;
}) => {
  return (
    <svg
      version="1.0"
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 512 512"
      preserveAspectRatio="xMidYMid meet"
      className={className}
    >
      <g
        transform="translate(0,512) scale(0.1,-0.1)"
        fill="#000000"
        stroke="none"
      >
        <path
          d="M1012 4413 c-56 -28 -77 -67 -80 -158 -3 -71 16 -200 43 -292 6 -19
          2 -22 -42 -28 -214 -26 -335 -60 -473 -131 -47 -24 -117 -68 -156 -97 l-71
          -54 -27 24 c-36 31 -112 32 -150 2 -47 -37 -59 -74 -52 -160 15 -177 70 -314
          160 -397 61 -55 110 -81 255 -136 52 -19 99 -40 104 -45 6 -6 14 -91 18 -193
          9 -197 27 -295 72 -385 56 -109 164 -190 293 -219 l74 -16 52 -77 c434 -649
          1214 -1167 1982 -1316 168 -33 292 -45 456 -45 647 0 1112 242 1310 682 33 74
          35 76 85 92 161 50 267 204 252 364 -13 131 -86 229 -217 290 -41 20 -76 37
          -78 38 -2 1 13 25 33 53 98 136 98 258 0 357 -27 27 -61 57 -74 65 l-23 14 20
          35 c28 47 52 135 52 184 -1 89 -66 170 -173 216 -52 23 -57 27 -51 50 45 182
          63 363 44 454 -29 140 -139 174 -274 85 -162 -108 -336 -368 -412 -614 -15
          -49 -28 -91 -29 -92 0 -1 -30 6 -65 17 -123 37 -248 53 -420 53 -219 -1 -361
          -24 -582 -95 l-98 -31 -52 44 c-29 24 -152 132 -273 240 -270 241 -412 356
          -577 466 l-127 85 -17 71 c-13 53 -18 121 -20 261 -1 104 -5 203 -8 220 -6 32
          -52 84 -93 105 -30 15 -109 14 -141 -3 -65 -34 -101 -102 -136 -259 l-23 -101
          -21 64 c-12 36 -28 103 -37 150 -16 91 -33 122 -85 158 -39 26 -100 29 -148 5z
          m117 -80 c15 -13 26 -46 41 -120 17 -86 52 -201 85 -276 6 -16 3 -17 -31 -13
          -22 3 -65 8 -96 11 l-58 6 -20 65 c-25 82 -40 173 -40 243 0 42 5 60 22 78 26
          27 68 30 97 6z m462 -22 c23 -19 24 -24 30 -228 4 -139 12 -234 23 -287 20
          -90 69 -244 96 -296 37 -73 36 -76 -21 -95 -65 -22 -165 -16 -231 12 l-46 21
          -21 88 c-31 134 -41 217 -40 349 0 184 43 380 95 432 29 29 82 31 115 4z
          m-781 -591 c104 -296 310 -580 575 -796 370 -301 1263 -756 1895 -964 278 -92
          386 -114 565 -114 125 -1 164 3 235 22 176 47 383 175 496 307 25 30 49 55 53
          55 4 0 17 -21 29 -46 22 -44 22 -47 6 -73 -9 -14 -60 -69 -113 -122 -150 -149
          -308 -236 -501 -275 -342 -69 -948 111 -1790 532 -476 238 -825 450 -1000 606
          -204 183 -401 432 -504 636 -41 82 -86 208 -99 278 -6 31 -5 32 46 47 29 8 56
          14 61 13 5 -1 25 -49 46 -106z m3730 -90 c50 -27 48 -209 -6 -447 -14 -63 -23
          -121 -20 -128 2 -7 29 -20 58 -29 111 -33 178 -94 178 -162 0 -44 -25 -115
          -61 -174 -16 -26 -29 -54 -29 -63 0 -8 33 -37 72 -64 88 -58 121 -107 115
          -169 -5 -47 -36 -114 -76 -162 l-27 -34 -38 74 c-142 271 -363 497 -604 617
          l-84 42 7 37 c43 232 264 570 426 650 49 25 62 26 89 12z m-4371 -32 c5 -13
          13 -59 19 -103 12 -89 42 -179 74 -220 31 -39 80 -67 215 -119 142 -55 202
          -100 222 -167 7 -23 17 -126 21 -228 11 -234 29 -303 99 -372 76 -77 106 -83
          441 -85 180 -1 303 -6 335 -13 125 -30 200 -100 326 -304 185 -299 293 -404
          477 -464 85 -27 277 -28 487 -3 307 37 339 29 579 -139 228 -160 321 -198 460
          -188 122 8 205 60 304 192 108 143 130 156 319 189 76 13 165 34 198 47 74 28
          155 105 173 165 16 56 15 143 -3 194 -8 24 -13 45 -11 48 3 2 27 -18 55 -46
          110 -110 106 -272 -9 -376 -63 -56 -85 -65 -370 -133 -127 -31 -164 -54 -286
          -181 -124 -129 -174 -163 -275 -187 -187 -44 -339 4 -602 189 -75 53 -161 108
          -190 121 -66 31 -127 32 -364 4 -199 -23 -365 -21 -468 6 -99 26 -215 88 -290
          157 -82 75 -155 172 -261 345 -97 159 -177 243 -249 263 -36 10 -127 15 -335
          16 -235 1 -295 4 -345 18 -154 44 -242 146 -276 321 -6 27 -14 132 -18 233
          -11 226 -6 218 -161 278 -235 92 -287 135 -340 288 -28 81 -45 222 -31 252 15
          33 68 34 80 2z m1001 -14 c156 -27 160 -29 180 -106 25 -98 24 -96 97 -130 55
          -26 83 -33 153 -36 81 -4 125 5 210 41 10 4 59 -25 137 -81 220 -157 464 -300
          680 -397 59 -27 135 -68 169 -92 167 -117 367 -173 621 -173 257 0 494 66 605
          168 l44 41 55 -31 c76 -44 185 -127 247 -190 l52 -54 -30 -41 c-63 -86 -193
          -163 -345 -204 -68 -19 -107 -22 -255 -23 -154 0 -191 3 -305 27 -427 91 -930
          280 -1430 536 -426 219 -764 446 -1002 675 l-88 85 56 1 c30 0 97 -7 149 -16z
          m422 -1481 c54 -24 77 -53 208 -258 143 -225 214 -308 337 -393 165 -116 394
          -154 698 -117 213 25 297 29 338 16 20 -7 98 -55 174 -108 76 -52 168 -112
          204 -134 195 -114 425 -129 602 -41 59 29 94 58 192 158 73 75 135 129 158
          139 44 18 199 56 205 50 2 -2 -12 -35 -33 -72 -197 -361 -578 -552 -1135 -570
          -360 -11 -710 61 -1095 226 -410 176 -841 490 -1128 818 -88 101 -227 282
          -227 295 0 9 177 16 336 13 95 -2 131 -7 166 -22z"
        />
      </g>
    </svg>
  );
};
