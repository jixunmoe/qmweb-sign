import secrets
from base64 import b64decode, b64encode
from itertools import cycle

from cryptography.hazmat.primitives.ciphers.aead import AESGCM

_REQUEST_KEY = b"\xbd\x30\x5f\x10\xd0\xff\x74\xb6\xef\x54\xda\xb8\x35\xb5\xe1\xcf"
_RESPONSE_KEY = b"\x7a\x3f\x8c\x1d\x5e\x9b\x2f\x0a\x6c\x4d\x7e\x8b\x1f\x3a\x5c\x9d\x0e\x2b\x6f\x4a\x81"


def ag1_request_encrypt(data: str) -> str:
    """Encrypt payload data for AG1 request."""
    aes_gcm = AESGCM(_REQUEST_KEY)
    nonce = secrets.token_bytes(12)
    ciphertext = aes_gcm.encrypt(nonce, data.encode(), None)
    return b64encode(nonce + ciphertext).decode()


def ag1_request_decrypt(data: str) -> str:
    """Decrypt payload data from AG1 request."""
    raw_data = b64decode(data.encode())
    aes_gcm = AESGCM(_REQUEST_KEY)
    nonce = raw_data[:12]
    ciphertext = raw_data[12:]
    return aes_gcm.decrypt(nonce, ciphertext, None).decode()


def ag1_response_encrypt(data: str) -> bytes:
    """Encrypt payload data for AG1 response."""
    return bytes(a ^ b for a, b in zip(data.encode(), cycle(_RESPONSE_KEY)))


def ag1_response_decrypt(data: bytes) -> str:
    """Decrypt payload data from AG1 response."""
    return bytes(a ^ b for a, b in zip(data, cycle(_RESPONSE_KEY))).decode()
