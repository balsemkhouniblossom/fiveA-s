import { Navigation } from "./navigation";
import { Homepage } from "./homepage";
import { ListeSpecialites } from "./specialite";
import { Contact } from "./contact";
import { Complaint } from "./Complaint";
export default function Pation() {
  return (
    <>
      <Navigation />
      <Homepage /> {/* Appel de Homepage */}
      <ListeSpecialites />{/* List des specialites */ }
      <Complaint></Complaint>{/* Complaint */ }   
      <Contact></Contact>{/* Contact */ }

    </>
  );
}
