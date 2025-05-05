import { networkInterfaces } from 'node:os';

/**
 * Get the local IP address of the machine.
 * @returns {string} The local IP address.
 */

const myIP = () => {
	const interfaces = Object.values(networkInterfaces());

	for (let interfaceArray of interfaces) {
		if (!interfaceArray || interfaceArray[1].family !== 'IPv4') continue;

		return interfaceArray[1].address;
	}

	return '127.0.0.1';
};

export { myIP };
