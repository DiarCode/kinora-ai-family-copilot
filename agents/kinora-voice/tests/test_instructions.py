from kinora_agent import build_instructions


def test_instructions_include_the_problem_and_both_parents() -> None:
    text = build_instructions(
        {
            "problem": "Bedtime has become a fight every night.",
            "participants": [
                {"id": "member_michael", "name": "Michael Bennett"},
                {"id": "member_lucy", "name": "Lucy Bennett"},
            ],
            "firstSpeakerName": "Michael Bennett",
        }
    )
    assert "Bedtime has become a fight every night." in text
    assert "Michael Bennett" in text
    assert "Lucy Bennett" in text
    assert "twenty-minute pause" in text
    assert "nine eight eight" in text


def test_instructions_have_a_safe_generic_fallback() -> None:
    text = build_instructions({})
    assert "recurring family disagreement" in text
    assert "the two parents" in text
    assert "Never decide who is right" in text
