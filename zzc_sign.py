#!/usr/bin/env python3

import sys
import re

from hashlib import sha1
from base64 import b64encode

PART_1_INDEXES = [23, 14, 6, 36, 16, 40, 7, 19]
PART_2_INDEXES = [16, 1, 32, 12, 19, 27, 8, 5]
SCRAMBLE_VALUES = [89, 39, 179, 150, 218, 82, 58, 252, 177,
                   52, 186, 123, 120, 64, 242, 133, 143, 161, 121, 179]

# JavaScript quirks emulation
PART_1_INDEXES = filter(lambda x: x < 40, PART_1_INDEXES)


def zzc_sign(payload: str) -> str:
    hash = sha1(payload.encode('utf-8')).hexdigest().upper() + '\x00'

    part1 = ''.join(map(lambda i: hash[i], PART_1_INDEXES))
    part2 = ''.join(map(lambda i: hash[i], PART_2_INDEXES))

    part3 = bytearray(20)
    for (i, v) in enumerate(SCRAMBLE_VALUES):
        value = v ^ int(hash[i*2:i*2+2], 16)
        part3[i] = value
    b64_part = re.sub(rb'[\\/+=\x00]', b'', b64encode(part3)).decode('utf-8')
    return f'zzc{part1}{b64_part}{part2}'.lower()


def main(payload: str) -> str:
    sign = zzc_sign(payload)
    print(f"sign={sign} (len={len(sign)})")


if __name__ == "__main__":
    main(sys.argv[1])
