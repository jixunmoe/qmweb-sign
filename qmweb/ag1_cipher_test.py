from base64 import b64decode

from qmweb.ag1_cipher import (ag1_request_decrypt, ag1_request_encrypt,
                              ag1_response_decrypt, ag1_response_encrypt)


def test_ag1_request_encryption():
    fixture = '{"hello":"ag1!"}'

    encrypted_data = ag1_request_encrypt(fixture)
    decrypted_data = ag1_request_decrypt(encrypted_data)

    # Assert that the decrypted data matches the original test data
    assert decrypted_data == fixture


def test_ag1_request_decryption():
    fixture = '{"hello":"ag1!"}'

    encrypted_data = ag1_request_encrypt(fixture)
    decrypted_data = ag1_request_decrypt(encrypted_data)

    # Assert that the decrypted data matches the original test data
    assert decrypted_data == fixture


def test_ag1_response_encryption():
    fixture = '{"hello":"ag1!"}'

    encrypted_data = ag1_response_encrypt(fixture)
    decrypted_data = ag1_response_decrypt(encrypted_data)

    # Assert that the decrypted data matches the original test data
    assert decrypted_data == fixture


def test_ag1_response_decryption():
    expected = '{"code":0,"ts":0,"start_ts":100,"traceid":"ffffffffffffffff"}'
    fixture = b64decode(b"AR3vcjr+DTBcYVz/bBhmrSIJHD7gCEvTaS25FTtcfVKpa0g9/mtCC2i7WFnqezj9SWwKKxjteVw6+2gJEg==")

    decrypted_data = ag1_response_decrypt(fixture)

    assert decrypted_data == expected
