# Pix Calculation in Airtable

# Pix Calculation Rule

Reminder of the calculation rule:

1.  From this point on, we only consider Skills:
    1.  With the **Status** field set to **active**;
    2.  Associated with at least one challenge with the **Status** field set to **validated**, **validated without test** or **pre-validated**.
    3.  Associated with a Competency whose **Origin** field is **Pix**
2.  For each Skill:
    1.  Count the number of skills:
        1.  in the same competency;
        2.  and at the same level.
    2.  Divide 8 by that number to obtain the Pix value; if the result is greater than 4, the value is capped at 4.

# Adding the Pix Calculation Fields

Reminder: the relevant object hierarchy is as follows:

*   Each Competency:
    *   contains Tubes…
        *   which contain Skills…
            *   which contain Challenges.

The idea is to build upwards the list of skill levels up to their competency, then back down to each skill which can then determine how many skills in its competency share the same level.

The following fields are added, in the order they are evaluated:

*   **Challenges**.**IsValidated** which equals 1 if the challenge is considered "validated" (rule 1.b), and 0 otherwise;
    *   Field type: Formula
    *   Formula: <span style="color: rgb(0,146,29);">IF(OR({Status}="validated", {Status}="validated without test", {Status}="pre-validated"), 1,0)</span>
    *   Example result: 1
*   **Skills**.**LevelIfActive** which equals the level (**Level**) of the skill if the **Status** is **active** (rule 1.a) and a validated challenge exists (rule 1.b), otherwise an empty string;
    *   To check whether a validated challenge exists, this field is a _rollup_ of the **IsValidated** field of the challenges associated with the skill; by summing the **IsValidated** values we can tell whether a validated challenge exists;
    *   Field type: Rollup
    *   Formula: <span style="color: rgb(0,146,29);">IF(AND(SUM(values) > 0, Status="active"), Level, "")</span>
    *   Example result: 3
*   **Tubes**.**SkillLevels** which computes the concatenation of the **LevelIfActive** values of the **Skills** contained in the tube;
    *   Field type: Rollup
    *   Formula: <span style="color: rgb(0,146,29);">CONCATENATE(values)</span>
    *   Example result: 1245
*   **Skills**.**Origin** which copies the **Origin** field of the competency onto each of its Tubes;
    *   Field type: Lookup
    *   Example result: "Pix"
*   **Competencies**.**SkillLevels** which in turn concatenates the **SkillLevels** rolled up from **Tubes**;
    *   Field type: Rollup
    *   Formula: <span style="color: rgb(0,146,29);">CONCATENATE(values)</span>
    *   Example result: 1544352134513675445363453124351241234
*   **Tubes**.**CompetencySkillLevels** which copies the **SkillLevels** field of the competency onto each of its Tubes;
    *   Field type: Lookup
    *   Example result: 1544352134513675445363453124351241234
*   **Skills**.**PixValue** which retrieves the **CompetencySkillLevels** from its Tube and therefore has the complete list of skill levels present in its competency, and uses it to calculate its Pix value:
    *   If the skill is not active in the sense of rule 1, its value is simply set to zero;
    *   If the skill is not of Pix origin, its value is simply set to zero;
    *   Otherwise, the number of occurrences of the skill's level must be determined in the level string. Since Airtable does not provide a function that directly gives this number, the difference is calculated between the length of the original string (e.g. 12434132), and that same string in which the level (e.g. 2) would have been replaced by an empty string (e.g. 143413), which gives the number of occurrences of the level in the competency;
    *   All that remains is to divide 8 by that number and cap the result at 4;
    *   Field type: Rollup
    *   Formula: <span style="color: rgb(0,146,29);">IF(LevelIfActive > 0, MIN(4, 8/(LEN(CONCATENATE(values)) - LEN(SUBSTITUTE( CONCATENATE(values),LevelIfActive,"")))), 0)</span>
    *   Note that even though at its core this is a simple copy of a value from the linked **Tube** record, which would normally correspond to a **lookup**, a **rollup** field type is used here in order to apply a formula. This forces us to use **CONCATENATE(values)** to obtain the **CompetencySkillLevels** value;
    *   It is useful to change the default field formatting to display a few decimal places;
    *   Example result: 1.333
