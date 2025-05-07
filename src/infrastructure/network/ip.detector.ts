import { networkInterfaces } from 'node:os';
import { Request } from 'express';

// Get the local IP address of the machine
const myIP = () => {
	// Get the network interfaces of the machine
	const interfaces = Object.values(networkInterfaces());

	// Loop through the network interfaces to find the first IPv4 address
	for (const interfaceArray of interfaces) {
		if (!interfaceArray || interfaceArray[1].family !== 'IPv4') continue;

		return interfaceArray[1].address;
	}

	return '127.0.0.1';
};

// Get the IP address of the request
const requestIP = (req: Request): string => {
	// Get the IP address from the request socket
	const ip = req.socket.remoteAddress?.replaceAll('::ffff:', '') || '127.0.0.1';
	return ip;
};

export { myIP, requestIP };
