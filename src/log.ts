export default function (...args: any[]) {
  console.log(new Date().toISOString(), ...args);
}
