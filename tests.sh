#!/bin/sh

# Enregistre les noms des dbs
DB_FILE="mydatabase.db"
BACKUP_FILE="mydatabase.db.old"

# Verifie si le fichier existe
if [[ ! -f "$DB_FILE" ]]; then
  echo "Erreur : La base de données '$DB_FILE' n'existe pas."
  exit 1
fi

# Création d'une sauvegarde
cp "$DB_FILE" "$BACKUP_FILE"
echo "Sauvegarde effectuée : $DB_FILE -> $BACKUP_FILE"

# Suppression des donées de la database
sqlite3 "$DB_FILE" "DELETE FROM sqlite_master WHERE type IN ('table', 'index', 'trigger'); VACUUM;"
echo "Toutes les données de '$DB_FILE' ont été supprimées."

./test/crud_roles.sh

# Restauration depuis la sauvegarde
cp "$BACKUP_FILE" "$DB_FILE"
echo "Données restaurées depuis '$BACKUP_FILE' vers '$DB_FILE'."
