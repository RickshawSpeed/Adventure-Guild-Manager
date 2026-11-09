# Adventurers are handed off between Headquarters and Dungeon only at Departure and Return

While a Party is on an Expedition, its Adventurers' state is owned exclusively by the Zone simulating them; the Headquarters cannot change them (no training, healing, or re-equipping an absent Adventurer). On Return, the Zone hands the Adventurers and their loot back to the Guild in a single transaction. We rejected shared ownership because concurrent writers from the tick loop and from Headquarters requests would need locking and invite lost updates.
