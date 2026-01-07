import Button from '../components/Button';

function Home() {
  return (
    <div>
      <Button text="Person" route="/person" />
      <Button text="Vehicle" route="/vehicle" />
      <Button text="Ship" route="/ship" />
      <Button text="Photography" route="/photography" />
      <Button text="Correspondance" />
      <Button text="Dashboard" route="/Dashboard" />
    </div>
  );
}

export default Home;



