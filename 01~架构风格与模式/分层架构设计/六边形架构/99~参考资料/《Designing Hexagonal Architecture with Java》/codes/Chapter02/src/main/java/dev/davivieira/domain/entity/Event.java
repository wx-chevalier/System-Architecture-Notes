package dev.davivieira.domain.entity;

import dev.davivieira.domain.policy.RegexEventParser;
import dev.davivieira.domain.policy.SplitEventParser;
import dev.davivieira.domain.vo.Activity;
import dev.davivieira.domain.vo.EventId;
import dev.davivieira.domain.vo.ParsePolicyType;
import dev.davivieira.domain.vo.Protocol;
import java.time.OffsetDateTime;
import java.util.Objects;

public class Event implements Comparable<Event> {

    private final OffsetDateTime timestamp;
    private final EventId id;
    private final Protocol protocol;
    private final Activity activity;

    public Event(OffsetDateTime timestamp, EventId id, Protocol protocol, Activity activity){
        this.timestamp = timestamp;
        this.id = id;
        this.protocol = protocol;
        this.activity = activity;
    }

    public static Event parsedEvent(String unparsedEvent, ParsePolicyType policy){
        return switch (policy) {
            case REGEX -> new RegexEventParser().parseEvent(unparsedEvent);
            case SPLIT -> new SplitEventParser().parseEvent(unparsedEvent);
        };
    }

    @Override
    public int compareTo(Event event) {
        return timestamp.compareTo(event.timestamp);
    }

    @Override
    public boolean equals(Object obj) {
        if (obj instanceof Event event) {
            return (event.timestamp.equals(this.timestamp)
                    && event.id.equals(this.id)
                    && event.protocol.equals(this.protocol)
                    && event.activity.equals(this.activity)
            );
        } else {
            return false;
        }
    }

    @Override
    public int hashCode() {
        return Objects.hash(timestamp, id, protocol, activity) + 31;
    }
}
