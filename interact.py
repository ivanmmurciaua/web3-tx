from web3 import Web3
import requests
import json
import os
import time

clearConsole = lambda: os.system('cls' if os.name in ('nt', 'dos') else 'clear')

def preparation():
    rpc_ok = False
    address_ok = False
    pk_ok = False
    chain_ok = False
    
    while rpc_ok == False:
        rpc = input('Escribe tu RPC aquí: ')
        try:
            response = requests.get(rpc)
            if response.status_code == 200:
                rpc_ok = True
        except:
            print("Error con el RPC")

    while address_ok == False:
        address = input('Escribe tu address: ')
        try:
            if Web3.isAddress(Web3.toChecksumAddress(address)):
                address_ok = True
        except:
            print("Escribe bien tu dirección")

    while pk_ok == False:
        pk = input('Escribe tu clave privada: ')
        try:
            if len(pk) == 64:
                pk_ok = True
        except:
            print("Escribe bien tu clave privada")

    while chain_ok == False:
        chain = input('Escribe el ID de la red: ')
        if chain != "":
            chain_ok = True
        else:
            print("Escribe bien tu clave privada")

    return [rpc, address, pk, chain]


def main():
    user_input = preparation()

    try:
        web3 = Web3(Web3.HTTPProvider(user_input[0]))
        #web3 = Web3(Web3.HTTPProvider("https://eth-goerli-rpc.gateway.pokt.network"))
    except:
        print("No se ha podido crear un objeto web3")
        exit

    contract_address_ok = False

    while contract_address_ok == False:
        contract_address = input('Escribe la address del contrato: ')
        try:
            if len(web3.eth.get_code(web3.toChecksumAddress(contract_address))) > 0:
                contract_address_ok = True
        except:
            print("Esa address no corresponde a ningún contrato")

    abi_ok = False

    while abi_ok == False:
        abi = input('Escribe el ABI del contrato: ')
        if len(abi) != 0:
            abi_ok = True

    clearConsole()
    time.sleep(1)

    print("Funciones del contrato")
    for X in json.loads(abi):
        funcion = ""
        if 'type' in X.keys():
            if X['type'] == 'function':
                if 'name' in X.keys():
                    funcion += X['name'] + "("
                    if len(X['inputs']) == 0:
                        funcion += ')'
                    else:
                        if 'inputs' in X.keys():
                            for idx, ind_input in enumerate(X['inputs']):
                                if idx == (len(X['inputs']) - 1):
                                    funcion += ind_input['name'] + ':' + ind_input['type'] + ')'
                                else:
                                    funcion += ind_input['name'] + ':' + ind_input['type'] + ', '
        print(funcion)

    contract = web3.eth.contract(address=contract_address, abi=abi)

if __name__ == '__main__':
    main()